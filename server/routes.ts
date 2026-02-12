
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

  // --- API: Get Rates (Mocked for now) ---
  app.get(api.rates.list.path, async (_req, res) => {
    // In a real app, this would fetch from an external forex API
    const mockRates = [
      { currency: "USD", rate: 83.50, symbol: "$", name: "US Dollar" },
      { currency: "EUR", rate: 90.20, symbol: "€", name: "Euro" },
      { currency: "GBP", rate: 105.80, symbol: "£", name: "British Pound" },
      { currency: "AUD", rate: 54.30, symbol: "A$", name: "Australian Dollar" },
      { currency: "CAD", rate: 61.50, symbol: "C$", name: "Canadian Dollar" },
      { currency: "SGD", rate: 62.10, symbol: "S$", name: "Singapore Dollar" },
      { currency: "AED", rate: 22.75, symbol: "dh", name: "UAE Dirham" },
      { currency: "THB", rate: 2.30, symbol: "฿", name: "Thai Baht" },
    ];
    
    res.json({
      lastUpdated: new Date().toISOString(),
      rates: mockRates
    });
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
