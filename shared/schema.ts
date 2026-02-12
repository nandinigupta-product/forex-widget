
import { pgTable, text, serial, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
// We'll store leads generated from the widget
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  product: text("product").notNull(), // 'card' | 'note'
  currency: text("currency").notNull(),
  amount: integer("amount").notNull(),
  convertedAmount: numeric("converted_amount"), // Estimated value
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true, convertedAmount: true });

// === EXPLICIT API TYPES ===
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;

// Request types
export type CreateLeadRequest = InsertLead;

// Response types
export type City = {
  code: string;
  name: string;
  aliases: string[];
  icon?: string;
  isTopCity?: boolean;
};

export type Rate = {
  currency: string;
  cardRate: number;
  notesRate: number;
  symbol: string;
  name: string;
  image?: string;
};

export type RatesResponse = {
  lastUpdated: string;
  rates: Rate[];
};
