
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- API: List Cities ---
  app.get(api.cities.list.path, async (_req, res) => {
    try {
      // Read the attached JSON file
      const citiesDataPath = path.join(process.cwd(), "attached_assets", "Cities_list_1770896077987.json");
      const fileContent = await fs.promises.readFile(citiesDataPath, 'utf-8');
      const data = JSON.parse(fileContent);
      
      const rawCities = data.cities || {};
      const citiesList = Object.entries(rawCities).map(([code, details]: [string, any]) => ({
        code: code,
        name: details.description || code,
        aliases: details.aliases_name || [],
        icon: details.icon,
        isTopCity: ["DEL", "MUM", "BNG", "CHN", "KOL", "HYD", "PUN", "GUR", "NOI"].includes(code)
      }));

      // Sort: Top cities first, then alphabetical
      citiesList.sort((a, b) => {
        if (a.isTopCity && !b.isTopCity) return -1;
        if (!a.isTopCity && b.isTopCity) return 1;
        return a.name.localeCompare(b.name);
      });

      res.json(citiesList);
    } catch (error) {
      console.error("Failed to load cities:", error);
      // Fallback if file missing
      res.json([
        { code: "DEL", name: "Delhi", aliases: ["New Delhi"], isTopCity: true },
        { code: "MUM", name: "Mumbai", aliases: ["Bombay"], isTopCity: true },
        { code: "BNG", name: "Bengaluru", aliases: ["Bangalore"], isTopCity: true }
      ]);
    }
  });

  // --- API: Get Rates from BookMyForex ---
  app.get(api.rates.list.path, async (req, res) => {
    try {
      const cityCode = ((req.query.city_code as string) || "DEL").toUpperCase();
      
      const response = await fetch(`https://www.bookmyforex.com/api/secure/v1/get-full-rate-card?city_code=${cityCode}`, {
        headers: {
          'accept': 'application/json, text/javascript, */*; q=0.01',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
          'content-type': 'application/json',
          'priority': 'u=1, i',
          'referer': 'https://www.bookmyforex.com/',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
          'x-requested-with': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        throw new Error(`External API responded with status: ${response.status}`);
      }

      const data: any = await response.json();
      
      // BookMyForex API returns { message, type, result: [...rates] }
      // result is directly an array of rate objects
      const bmfRates: any[] = Array.isArray(data.result) ? data.result : [];

      const formattedRates = bmfRates.map((item: any) => {
        const currency = item.currency_code;
        // bpc = Buy Prepaid Card rate (forex card)
        // bcn = Buy Cash Notes rate
        // b = best buy rate (usually same as bpc)
        const cardRate = parseFloat(item.bpc || item.b || "0");
        const notesRate = parseFloat(item.bcn || item.b || "0");
        const name = item.currency_description || "";
        const image = item.currency_image || "";
        
        return { currency, cardRate, notesRate, symbol: "", name, image };
      }).filter((r: any) => (r.cardRate > 0 || r.notesRate > 0) && r.currency);
      
      res.json({
        lastUpdated: new Date().toISOString(),
        rates: formattedRates
      });
    } catch (error) {
      console.error("Failed to fetch rates from BookMyForex:", error);
      res.status(500).json({ message: "Failed to fetch exchange rates" });
    }
  });

  // --- API: Create Lead ---
  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
