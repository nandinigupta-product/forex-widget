
import { z } from 'zod';
import { insertLeadSchema, leads } from './schema';

// === SHARED ERROR SCHEMAS ===
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// === API CONTRACT ===
export const api = {
  cities: {
    list: {
      method: 'GET' as const,
      path: '/api/cities' as const,
      responses: {
        200: z.array(z.object({
          code: z.string(),
          name: z.string(),
          aliases: z.array(z.string()),
          icon: z.string().optional(),
          isTopCity: z.boolean().optional(),
          serviceableCard: z.boolean().optional(),
          serviceableNotes: z.boolean().optional(),
        })),
      },
    },
  },
  rates: {
    list: {
      method: 'GET' as const,
      path: '/api/rates' as const,
      input: z.object({
        city_code: z.string().optional(),
      }).optional(),
      responses: {
        200: z.object({
          lastUpdated: z.string(),
          rates: z.array(z.object({
            currency: z.string(),
            cardRate: z.number(),
            notesRate: z.number(),
            notesComboRate: z.number().optional(),
            symbol: z.string(),
            name: z.string(),
            image: z.string().optional(),
          })),
        }),
      },
    },
  },
  betterRate: {
    get: {
      method: 'POST' as const,
      path: '/api/better-rate' as const,
      input: z.object({
        amount: z.number(),
        currencyCode: z.string(),
        product: z.enum(["CN", "PC"]),
        cityCode: z.string(),
      }),
      responses: {
        200: z.object({
          discountCode: z.string().nullable(),
          flatDiscount: z.number(),
          originalRate: z.number(),
          totalAmount: z.number(),
          grandTotal: z.number().optional(),
        }),
      },
    },
  },
  leads: {
    create: {
      method: 'POST' as const,
      path: '/api/leads' as const,
      input: insertLeadSchema,
      responses: {
        201: z.custom<typeof leads.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

// === HELPER ===
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// === TYPE EXPORTS ===
export type CreateLeadInput = z.infer<typeof api.leads.create.input>;
export type CitiesResponse = z.infer<typeof api.cities.list.responses[200]>;
export type RatesResponse = z.infer<typeof api.rates.list.responses[200]>;
