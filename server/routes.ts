
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import fs from 'fs';
import path from 'path';

const bmfCityCodeMap: Record<string, string> = {
  "AHM": "AMD",
  "AGR": "AGRA",
  "ANA": "AMD",
  "AUR": "PUN",
  "BAR": "DEL",
  "BHB": "CUTT",
  "BHP": "IND",
  "CHA": "CHD",
  "COI": "CHN",
  "DEH": "DEL",
  "FAR": "FBD",
  "GNO": "NOI",
  "GWL": "DEL",
  "HSR": "BNG",
  "JAB": "IND",
  "JAL": "CHD",
  "JOD": "JODH",
  "KNP": "KANP",
  "KPR": "CHD",
  "KRN": "DEL",
  "KZH": "KOC",
  "LDH": "CHD",
  "LKO": "LCK",
  "MOH": "CHD",
  "MYS": "BNG",
  "NSK": "NASH",
  "NWN": "CHD",
  "PCK": "CHD",
  "PNV": "PANV",
  "PTL": "CHD",
  "RJK": "AMD",
  "SAL": "CHN",
  "THA": "THAN",
  "VIJ": "HYD",
  "WRG": "HYD",
};

function toBmfCityCode(code: string): string {
  const upper = code.toUpperCase();
  return bmfCityCodeMap[upper] || upper;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // --- API: List Cities ---
  app.get(api.cities.list.path, async (_req, res) => {
    try {
      const topCityOrder = ["MUM", "DEL", "BNG", "HYD", "PUN", "CHN", "GUR", "NOI", "KOL"];

      const cardServiceableCodes = new Set(["AHM","BNG","CHA","CHN","DEL","FAR","GHZ","GUR","HYD","JAI","KNP","KOL","LKO","MOH","MUM","NOI","PCK","PUN"]);
      const notesServiceableCodes = new Set(["AGR","AHM","AMR","ANA","AUR","BAR","BHB","BHP","BNG","CHA","CHN","COI","CUTT","DEH","DEL","FAR","GHZ","GNO","GOA","GUR","GWH","GWL","HSR","HYD","IND","JAB","JAI","JAL","JAM","JOD","KNP","KOC","KOL","KOT","KPR","KRN","KZH","LDH","LKO","MAD","MNG","MOH","MUM","MYS","NAG","NOI","NSK","NVM","NWN","PAT","PCK","PNV","PTL","PUN","RAI","RAN","RJK","SAL","SUR","THA","THI","UDP","VAD","VAR","VIJ","VSK","WRG"]);

      const allCities: Record<string, { name: string; aliases: string[] }> = {
        "MUM": { name: "Mumbai", aliases: ["Bombay", "Bambai", "Mumbai Suburban"] },
        "DEL": { name: "Delhi", aliases: ["New Delhi", "NCR Delhi", "Dilli"] },
        "BNG": { name: "Bengaluru", aliases: ["Bangalore", "Banglore", "Bengalooru"] },
        "HYD": { name: "Hyderabad", aliases: ["Hedrabad", "Bhagyanagar", "Secunderabad"] },
        "PUN": { name: "Pune", aliases: ["Poona", "Puna"] },
        "CHN": { name: "Chennai", aliases: ["Madras", "Chenai"] },
        "GUR": { name: "Gurugram / Gurgaon", aliases: ["Gurugram", "Gurgaon", "Gurgava"] },
        "NOI": { name: "Noida", aliases: ["Greater Noida", "NOIDA", "Gautam Budh Nagar"] },
        "KOL": { name: "Kolkata", aliases: ["Calcutta", "Kolkatta"] },
        "AGR": { name: "Agra", aliases: [] },
        "AHM": { name: "Ahmedabad", aliases: ["Amdavad", "Amadavad"] },
        "AHMN": { name: "Ahmednagar", aliases: [] },
        "AJM": { name: "Ajmer", aliases: [] },
        "ALLA": { name: "Allahabad", aliases: ["Prayagraj"] },
        "ALU": { name: "Aluva", aliases: [] },
        "ALW": { name: "Alwar", aliases: [] },
        "AMB": { name: "Ambala", aliases: [] },
        "AMBC": { name: "Ambala Cantonment", aliases: [] },
        "AMR": { name: "Amritsar", aliases: [] },
        "ANA": { name: "Anand", aliases: [] },
        "ANK": { name: "Ankleshwar", aliases: [] },
        "AUR": { name: "Aurangabad", aliases: [] },
        "AZM": { name: "Azamgarh", aliases: [] },
        "BGKT": { name: "Bagalkot", aliases: [] },
        "BPUR": { name: "Bagha Purana", aliases: [] },
        "BAN": { name: "Baner", aliases: [] },
        "BANG": { name: "Banga", aliases: [] },
        "BAR": { name: "Bareilly", aliases: ["Bareli"] },
        "BARN": { name: "Barnala", aliases: [] },
        "BTH": { name: "Bathinda", aliases: ["Bhatinda"] },
        "BELG": { name: "Belgaum", aliases: ["Belagavi"] },
        "BET": { name: "Bettiah", aliases: [] },
        "BHR": { name: "Bharuch", aliases: [] },
        "BHV": { name: "Bhavnagar", aliases: [] },
        "BHW": { name: "Bhiwandi", aliases: [] },
        "BHP": { name: "Bhopal", aliases: [] },
        "BHB": { name: "Bhubaneswar", aliases: [] },
        "BJP": { name: "Bijapur", aliases: [] },
        "BIL": { name: "Bilaspur", aliases: [] },
        "BOD": { name: "Bodakdev", aliases: [] },
        "CHK": { name: "Chakan", aliases: [] },
        "CHA": { name: "Chandigarh", aliases: ["Chandigadh"] },
        "CHP": { name: "Chiplun", aliases: [] },
        "CHU": { name: "Churu", aliases: [] },
        "COI": { name: "Coimbatore", aliases: ["Kovai"] },
        "CUD": { name: "Cuddalore", aliases: [] },
        "CUTT": { name: "Cuttack", aliases: [] },
        "DAL": { name: "Dalhousie", aliases: [] },
        "DAM": { name: "Daman", aliases: [] },
        "DAR": { name: "Darbhanga", aliases: [] },
        "DARJ": { name: "Darjeeling", aliases: [] },
        "DAS": { name: "Dasuya", aliases: [] },
        "DEE": { name: "Deesa", aliases: [] },
        "DEH": { name: "Dehradun", aliases: ["Dehra Dun"] },
        "DEW": { name: "Dewas", aliases: [] },
        "DHA": { name: "Dharamshala", aliases: ["Dharmsala", "McLeod Ganj"] },
        "DHW": { name: "Dharwad", aliases: [] },
        "DSN": { name: "Dilsukh Nagar", aliases: [] },
        "DUR": { name: "Durgapur", aliases: [] },
        "ERN": { name: "Ernakulam", aliases: [] },
        "ERO": { name: "Erode", aliases: [] },
        "FAR": { name: "Faridabad", aliases: [] },
        "FATB": { name: "Fatehabad", aliases: [] },
        "FATP": { name: "Fatehpur", aliases: [] },
        "FER": { name: "Ferozpur", aliases: ["Ferozepur", "Firozpur"] },
        "GDM": { name: "Gandhidham", aliases: [] },
        "GAN": { name: "Gangtok", aliases: [] },
        "GRD": { name: "Gardhiwal", aliases: [] },
        "GSH": { name: "Garhshankar", aliases: [] },
        "GWP": { name: "Gawli Palasia", aliases: [] },
        "GAY": { name: "Gaya", aliases: [] },
        "GHZ": { name: "Ghaziabad", aliases: [] },
        "GOA": { name: "Goa", aliases: ["Panaji", "Panjim"] },
        "GOK": { name: "Gokak", aliases: [] },
        "GOR": { name: "Gorakhpur", aliases: [] },
        "GNO": { name: "Greater Noida", aliases: [] },
        "GUN": { name: "Guntur", aliases: [] },
        "GDS": { name: "Gurdaspur", aliases: [] },
        "GWH": { name: "Guwahati", aliases: ["Gauhati"] },
        "GWL": { name: "Gwalior", aliases: [] },
        "HAN": { name: "Hanmakonda", aliases: [] },
        "HIM": { name: "Himatnagar", aliases: [] },
        "HSP": { name: "Hoshiarpur", aliases: [] },
        "HSR": { name: "Hosur", aliases: [] },
        "HUBL": { name: "Hubli", aliases: ["Hubballi"] },
        "IND": { name: "Indore", aliases: [] },
        "JAB": { name: "Jabalpur", aliases: [] },
        "JAG": { name: "Jagraon", aliases: [] },
        "JAI": { name: "Jaipur", aliases: [] },
        "JAL": { name: "Jalandhar", aliases: [] },
        "JLG": { name: "Jalgaon", aliases: [] },
        "JLP": { name: "Jalpaiguri", aliases: [] },
        "JAM": { name: "Jammu", aliases: [] },
        "JMN": { name: "Jamnagar", aliases: [] },
        "JMS": { name: "Jamshedpur", aliases: [] },
        "JHJ": { name: "Jhunjhunu", aliases: [] },
        "JOD": { name: "Jodhpur", aliases: [] },
        "KDP": { name: "Kadapa", aliases: [] },
        "KDY": { name: "Kadayanallur", aliases: [] },
        "KLY": { name: "Kalyan", aliases: [] },
        "KLNI": { name: "Kalyani", aliases: [] },
        "KCH": { name: "Kancheepuram", aliases: [] },
        "KNG": { name: "Kanhangad", aliases: [] },
        "KNR": { name: "Kannur", aliases: ["Cannanore"] },
        "KNP": { name: "Kanpur", aliases: [] },
        "KANY": { name: "Kanyakumari", aliases: [] },
        "KPR": { name: "Kapurthala", aliases: [] },
        "KRK": { name: "Karaikudi", aliases: [] },
        "KMN": { name: "Karimnagar", aliases: [] },
        "KRN": { name: "Karnal", aliases: [] },
        "KRR": { name: "Karur", aliases: [] },
        "KAS": { name: "Kasia", aliases: [] },
        "KEO": { name: "Keonjhar", aliases: [] },
        "KHA": { name: "Khanna", aliases: [] },
        "KOC": { name: "Kochi", aliases: ["Cochin", "Ernakulam"] },
        "KLH": { name: "Kolhapur", aliases: [] },
        "KLM": { name: "Kollam", aliases: ["Quilon"] },
        "KOT": { name: "Kota", aliases: [] },
        "KTY": { name: "Kottayam", aliases: [] },
        "KZH": { name: "Kozhikode", aliases: ["Calicut"] },
        "KSN": { name: "Krishnanagar", aliases: [] },
        "KUK": { name: "Kukatpally", aliases: [] },
        "KMB": { name: "Kumbakonam", aliases: [] },
        "KUR": { name: "Kurukshetra", aliases: [] },
        "LAM": { name: "Lambra", aliases: [] },
        "LEH": { name: "Leh", aliases: ["Ladakh"] },
        "LKO": { name: "Lucknow", aliases: [] },
        "LDH": { name: "Ludhiana", aliases: [] },
        "MAD": { name: "Madurai", aliases: [] },
        "MHP": { name: "Mahilpur", aliases: [] },
        "MNL": { name: "Manali", aliases: [] },
        "MNG": { name: "Mangalore", aliases: ["Mangaluru"] },
        "MRG": { name: "Margao", aliases: [] },
        "MAU": { name: "Mau", aliases: [] },
        "MYL": { name: "Mayiladuthurai", aliases: [] },
        "MCL": { name: "McLeod Ganj", aliases: [] },
        "MRT": { name: "Meerut", aliases: [] },
        "MHS": { name: "Mehsana", aliases: [] },
        "MIL": { name: "Miller Ganj", aliases: [] },
        "MOG": { name: "Moga", aliases: [] },
        "MOH": { name: "Mohali", aliases: [] },
        "MRD": { name: "Moradabad", aliases: [] },
        "MZF": { name: "Muzaffarpur", aliases: [] },
        "MYS": { name: "Mysore", aliases: ["Mysuru"] },
        "NAD": { name: "Nadiad", aliases: [] },
        "NGP": { name: "Nagapattinam", aliases: [] },
        "NGC": { name: "Nagercoil", aliases: [] },
        "NAG": { name: "Nagpur", aliases: [] },
        "NKD": { name: "Nakodar", aliases: [] },
        "NSK": { name: "Nashik", aliases: ["Nasik"] },
        "NVM": { name: "Navi Mumbai", aliases: [] },
        "NVS": { name: "Navsari", aliases: [] },
        "NWN": { name: "Nawanshahr", aliases: [] },
        "NEL": { name: "Nellore", aliases: [] },
        "NIZ": { name: "Nizamabad", aliases: [] },
        "NRP": { name: "Nurpurbedi", aliases: [] },
        "PAD": { name: "Padampur", aliases: [] },
        "PAL": { name: "Pala", aliases: [] },
        "PLK": { name: "Palakkad", aliases: ["Palghat"] },
        "PCK": { name: "Panchkula", aliases: [] },
        "PNP": { name: "Panipat", aliases: [] },
        "PAN": { name: "Panji", aliases: ["Panjim", "Panaji"] },
        "PNV": { name: "Panvel", aliases: [] },
        "PTH": { name: "Pathanamthitta", aliases: [] },
        "PTK": { name: "Pathankot", aliases: [] },
        "PTL": { name: "Patiala", aliases: [] },
        "PAT": { name: "Patna", aliases: [] },
        "PEH": { name: "Pehowa", aliases: [] },
        "PHG": { name: "Phagwara", aliases: [] },
        "PHL": { name: "Phillaur", aliases: [] },
        "POL": { name: "Pollachi", aliases: [] },
        "PDY": { name: "Pondicherry", aliases: ["Puducherry", "Pondy"] },
        "PDK": { name: "Pudukottai", aliases: [] },
        "PNL": { name: "Punalur", aliases: [] },
        "PUR": { name: "Purasawalkam", aliases: [] },
        "PUT": { name: "Puttaparty", aliases: [] },
        "RAI": { name: "Raipur", aliases: [] },
        "RJK": { name: "Rajkot", aliases: [] },
        "RAN": { name: "Ranchi", aliases: [] },
        "RAT": { name: "Ratnagiri", aliases: [] },
        "RAZ": { name: "Razole", aliases: [] },
        "SAL": { name: "Salem", aliases: [] },
        "SNG": { name: "Sanganer", aliases: [] },
        "SNI": { name: "Sangli", aliases: [] },
        "SEC": { name: "Secunderabad", aliases: [] },
        "SHM": { name: "Shimla", aliases: ["Simla"] },
        "SHR": { name: "Shirdi", aliases: [] },
        "SIL": { name: "Siliguri", aliases: [] },
        "SOL": { name: "Solan", aliases: [] },
        "SLP": { name: "Solapur", aliases: ["Sholapur"] },
        "SGN": { name: "Sri Ganganagar", aliases: [] },
        "SUD": { name: "Sudhar", aliases: [] },
        "SUJ": { name: "Sujangarh", aliases: [] },
        "SUL": { name: "Sultanpur", aliases: [] },
        "SUN": { name: "Sunder-Nagar", aliases: [] },
        "SUR": { name: "Surat", aliases: [] },
        "THL": { name: "Talli haldwani", aliases: ["Haldwani"] },
        "TAN": { name: "Tanda", aliases: [] },
        "TAR": { name: "Taramani", aliases: [] },
        "TTR": { name: "Tarn Taran", aliases: [] },
        "THS": { name: "Thalassery", aliases: ["Tellicherry"] },
        "THA": { name: "Thane", aliases: [] },
        "THJ": { name: "Thanjavur", aliases: ["Tanjore"] },
        "THV": { name: "Thiruvalur", aliases: [] },
        "THI": { name: "Thiruvananthapuram", aliases: ["Trivandrum"] },
        "TVR": { name: "Thiruvarur", aliases: [] },
        "TDP": { name: "Thodupuzha", aliases: [] },
        "TRI": { name: "Thrissur", aliases: ["Trichur"] },
        "TIRU": { name: "Tiruchirappalli", aliases: ["Trichy"] },
        "TPR": { name: "Tirupur", aliases: [] },
        "TRR": { name: "Tirur", aliases: [] },
        "UDP": { name: "Udaipur", aliases: [] },
        "UDU": { name: "Udupi", aliases: [] },
        "UJJ": { name: "Ujjain", aliases: [] },
        "UNA": { name: "Una", aliases: [] },
        "URA": { name: "Urapar", aliases: [] },
        "VDK": { name: "Vadakara", aliases: [] },
        "VAD": { name: "Vadodara", aliases: ["Baroda"] },
        "VVN": { name: "Vallabh Vidyanagar", aliases: [] },
        "VLS": { name: "Valsad", aliases: [] },
        "VAP": { name: "Vapi", aliases: [] },
        "VAR": { name: "Varanasi", aliases: ["Banaras", "Kashi"] },
        "VRK": { name: "Varkala", aliases: [] },
        "VAS": { name: "Vastrapur", aliases: [] },
        "VEL": { name: "Vellore", aliases: [] },
        "VER": { name: "Verka", aliases: [] },
        "VIJ": { name: "Vijayawada", aliases: [] },
        "VIL": { name: "Villupuram", aliases: [] },
        "VIR": { name: "Virugambakkam", aliases: [] },
        "VSK": { name: "Visakhapatnam", aliases: ["Vizag"] },
        "WRG": { name: "Warangal", aliases: [] },
        "YMN": { name: "Yamunanagar", aliases: [] },
      };

      const citiesList = Object.entries(allCities).map(([code, details]) => ({
        code,
        name: details.name,
        aliases: details.aliases,
        isTopCity: topCityOrder.includes(code),
        serviceableCard: cardServiceableCodes.has(code),
        serviceableNotes: notesServiceableCodes.has(code),
      }));

      citiesList.sort((a, b) => {
        const aTop = topCityOrder.indexOf(a.code);
        const bTop = topCityOrder.indexOf(b.code);
        if (aTop !== -1 && bTop !== -1) return aTop - bTop;
        if (aTop !== -1) return -1;
        if (bTop !== -1) return 1;
        return a.name.localeCompare(b.name);
      });

      res.json(citiesList);
    } catch (error) {
      console.error("Failed to load cities:", error);
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
      const rawCityCode = ((req.query.city_code as string) || "DEL").toUpperCase();
      const cityCode = toBmfCityCode(rawCityCode);
      
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

      const currencyPopularityOrder = [
        "USD", "EUR", "GBP", "AUD", "CAD", "SGD", "NZD", "HKD",
        "AED", "SAR", "CHF", "JPY", "SEK", "THB", "MYR", "CNY",
        "ZAR", "OMR", "BHD", "KWD", "NOK", "DKK", "IDR", "LKR",
        "KRW", "RUB", "PHP", "VND", "MUR", "BDT", "CZK", "MOP",
        "PLN", "ILS", "EGP", "KES", "BRL", "QAR", "MVR"
      ];

      const formattedRates = bmfRates.map((item: any) => {
        const currency = item.currency_code;
        const cardRate = parseFloat(item.bpc || item.b || "0");
        const notesRate = parseFloat(item.bcn || item.b || "0");
        const notesComboRate = item.bcn_combo ? parseFloat(item.bcn_combo) : undefined;
        const name = item.currency_description || "";
        const image = item.currency_image || "";
        
        return { currency, cardRate, notesRate, notesComboRate, symbol: "", name, image };
      }).filter((r: any) => (r.cardRate > 0 || r.notesRate > 0) && r.currency);

      formattedRates.sort((a: any, b: any) => {
        const aIdx = currencyPopularityOrder.indexOf(a.currency);
        const bIdx = currencyPopularityOrder.indexOf(b.currency);
        const aPos = aIdx !== -1 ? aIdx : 999;
        const bPos = bIdx !== -1 ? bIdx : 999;
        if (aPos !== bPos) return aPos - bPos;
        return a.name.localeCompare(b.name);
      });
      
      res.json({
        lastUpdated: new Date().toISOString(),
        rates: formattedRates
      });
    } catch (error) {
      console.error("Failed to fetch rates from BookMyForex:", error);
      res.status(500).json({ message: "Failed to fetch exchange rates" });
    }
  });

  // --- API: Get Better Rate (Discount Code) ---
  app.post(api.betterRate.get.path, async (req, res) => {
    try {
      const input = api.betterRate.get.input.parse(req.body);

      const bmfHeaders = {
        'accept': 'application/json, text/javascript, */*; q=0.01',
        'content-type': 'application/json',
        'origin': 'https://www.bookmyforex.com',
        'referer': 'https://www.bookmyforex.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
      };

      const bmfCity = toBmfCityCode(input.cityCode);

      const rateCardResponse = await fetch(`https://www.bookmyforex.com/api/secure/v1/get-full-rate-card?city_code=${bmfCity}`, {
        headers: bmfHeaders
      });
      const rateData: any = await rateCardResponse.json();
      const bmfRates: any[] = Array.isArray(rateData.result) ? rateData.result : [];
      const currencyRate = bmfRates.find((r: any) => r.currency_code === input.currencyCode);

      if (!currencyRate) {
        return res.status(404).json({ message: "Currency rate not found" });
      }

      const originalRate = input.product === "CN"
        ? parseFloat(currencyRate.bcn || "0")
        : parseFloat(currencyRate.bpc || "0");

      if (originalRate <= 0) {
        return res.status(404).json({ message: "Rate not available" });
      }

      const bmfResponse = await fetch('https://www.bookmyforex.com/api/secure/better-rate/v1/save-better-rate', {
        method: 'POST',
        headers: bmfHeaders,
        body: JSON.stringify({
          email: "guest@bookmyforex.com",
          phone: "9999999999",
          name: "Guest User",
          rate: String(originalRate),
          device_type_code: "web",
          order_type_code: "B",
          city_code: bmfCity,
          lead_source_code: "betterRate",
          cop_list: [{
            currency_code: input.currencyCode,
            product_code: input.product,
            foreign_amount: String(input.amount),
            order_type: "B"
          }]
        })
      });

      let discountCode = bmfResponse.headers.get('response_token') || null;

      let flatDiscount = 0;
      let totalAmount = 0;
      let grandTotal = 0;

      try {
        const bmfData: any = await bmfResponse.json();

        const result = bmfData?.result || bmfData;
        const discounts: any[] = Array.isArray(result?.betterRateDiscounts)
          ? result.betterRateDiscounts
          : (Array.isArray(bmfData?.betterRateDiscounts) ? bmfData.betterRateDiscounts : []);

        if (discounts.length > 0) {
          const disc = discounts[0];
          flatDiscount = parseFloat(disc.flat_discount ?? disc.margin_value ?? 0);
          totalAmount = parseFloat(disc.total_amount ?? 0);
          grandTotal = parseFloat(disc.grand_total ?? 0);
          if (!discountCode && disc.better_rate_key) {
            discountCode = disc.better_rate_key;
          }
        }
      } catch {
        if (input.product === "CN") {
          const comboRate = currencyRate.bcn_combo ? parseFloat(currencyRate.bcn_combo) : 0;
          if (comboRate > 0 && comboRate < originalRate) {
            flatDiscount = parseFloat(((originalRate - comboRate) * input.amount).toFixed(2));
          }
        }
      }

      if (flatDiscount <= 0) {
        flatDiscount = 0;
      }

      res.json({
        discountCode: flatDiscount > 0 ? (discountCode || "BMFRATE") : null,
        flatDiscount,
        originalRate,
        totalAmount: totalAmount > 0 ? totalAmount : originalRate * input.amount,
        grandTotal: grandTotal > 0 ? grandTotal : undefined,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Failed to get better rate:", err);
      res.status(500).json({ message: "Failed to fetch better rate" });
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
