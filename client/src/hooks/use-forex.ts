import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateLeadInput } from "@shared/routes";

// === READ HOOKS ===

export function useCities() {
  return useQuery({
    queryKey: [api.cities.list.path],
    queryFn: async () => {
      const res = await fetch(api.cities.list.path);
      if (!res.ok) throw new Error("Failed to fetch cities");
      return api.cities.list.responses[200].parse(await res.json());
    },
  });
}

export function useRates(cityCode?: string) {
  return useQuery({
    queryKey: [api.rates.list.path, cityCode],
    queryFn: async () => {
      const url = cityCode 
        ? `${api.rates.list.path}?city_code=${cityCode}`
        : api.rates.list.path;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch rates");
      return api.rates.list.responses[200].parse(await res.json());
    },
    // Refresh rates every 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

export function useBetterRate(params: { amount: number; currencyCode: string; product: "CN" | "PC"; cityCode: string } | null) {
  return useQuery({
    queryKey: [api.betterRate.get.path, params?.amount, params?.currencyCode, params?.product, params?.cityCode],
    queryFn: async () => {
      if (!params || !params.amount || params.amount <= 0) return null;
      const res = await fetch(api.betterRate.get.path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) return null;
      return api.betterRate.get.responses[200].parse(await res.json());
    },
    enabled: !!params && params.amount > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// === MUTATION HOOKS ===

export function useCreateLead() {
  return useMutation({
    mutationFn: async (data: CreateLeadInput) => {
      const res = await fetch(api.leads.create.path, {
        method: api.leads.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.leads.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create lead");
      }

      return api.leads.create.responses[201].parse(await res.json());
    },
  });
}
