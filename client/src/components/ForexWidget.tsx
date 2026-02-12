import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Zap, Shield, TrendingDown, Clock } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useRates, useCreateLead } from "@/hooks/use-forex";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CitySelector } from "./CitySelector";

export function ForexWidget() {
  const [location] = useLocation();
  const search = useSearch();

  const searchParams = new URLSearchParams(search);
  const defaultCity = searchParams.get("city")?.toUpperCase().slice(0, 3) || "DEL";

  const [product, setProduct] = React.useState<"note" | "card">("note");
  const [city, setCity] = React.useState(defaultCity);
  const [currency, setCurrency] = React.useState("USD");
  const [amount, setAmount] = React.useState<number | "">(1000);

  const { data: ratesData, isLoading: isLoadingRates } = useRates(city);
  const { mutate: createLead, isPending } = useCreateLead();
  const { toast } = useToast();

  const selectedRate = ratesData?.rates.find((r) => r.currency === currency);
  const activeRate = selectedRate ? (product === "card" ? selectedRate.cardRate : selectedRate.notesRate) : 0;
  const convertedAmount = amount && activeRate ? (Number(amount) * activeRate).toFixed(2) : null;

  const savings = amount && activeRate ? (Number(amount) * activeRate * 0.035).toFixed(0) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !activeRate) return;

    createLead(
      {
        city,
        product,
        currency,
        amount: Number(amount),
      },
      {
        onSuccess: () => {
          toast({
            title: "Order Request Received!",
            description: `We'll contact you shortly about your ${currency} ${product === 'card' ? 'Forex Card' : 'Notes'}.`,
            duration: 5000,
          });
          setAmount("");
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: err.message,
          });
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="w-full max-w-[420px] mx-auto"
    >
      <div className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-[#093562] px-5 py-4">
          <h2 className="text-lg font-semibold text-white" data-testid="text-widget-title">Buy Forex Online</h2>
          <p className="text-blue-200 text-xs mt-0.5">Best rates guaranteed, delivered to your door.</p>
        </div>

        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex rounded-md border border-gray-300 overflow-hidden" data-testid="tabs-product">
              <button
                type="button"
                onClick={() => setProduct("note")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  product === "note"
                    ? "bg-[#093562] text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                data-testid="tab-notes"
              >
                Currency Notes
              </button>
              <button
                type="button"
                onClick={() => setProduct("card")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                  product === "card"
                    ? "bg-[#093562] text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                data-testid="tab-card"
              >
                Forex Card
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Select City</label>
              <CitySelector value={city} onChange={setCity} />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Currency</label>
              <Select value={currency} onValueChange={setCurrency} disabled={isLoadingRates}>
                <SelectTrigger className="h-10 rounded-md bg-white border-gray-300 text-sm" data-testid="select-currency">
                  <SelectValue>
                    {selectedRate ? (
                      <span className="flex items-center gap-2">
                        {selectedRate.image && <img src={selectedRate.image} alt={selectedRate.currency} className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0" />}
                        <span className="truncate">{selectedRate.name}</span>
                      </span>
                    ) : "Select currency"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-md border-gray-300 shadow-lg max-h-[280px]">
                  {ratesData?.rates.map((rate) => (
                    <SelectItem key={rate.currency} value={rate.currency} className="cursor-pointer py-2 text-sm">
                      <span className="flex items-center gap-2">
                        {rate.image && <img src={rate.image} alt={rate.currency} className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0" />}
                        <span className="truncate">{rate.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Amount ({currency})</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="1000"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  className="w-full h-12 rounded-md bg-white border border-gray-300 text-base font-semibold pl-3 pr-3 focus:outline-none focus:ring-2 focus:ring-[#093562]/30 focus:border-[#093562]"
                  data-testid="input-amount"
                />
                {selectedRate && activeRate > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-right" data-testid="rate-display">
                    <span className="text-[11px] text-gray-400 block leading-tight" data-testid="text-rate">
                      1 {currency} = ₹{activeRate.toFixed(2)}
                    </span>
                    {convertedAmount && (
                      <span className="text-xs font-bold text-[#093562] block leading-tight" data-testid="text-converted-amount">
                        = ₹{Number(convertedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {savings && Number(savings) > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-md px-3 py-2"
                data-testid="savings-banner"
              >
                <TrendingDown className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-xs text-green-700 font-medium">
                  You save upto <span className="font-bold">₹{Number(savings).toLocaleString('en-IN')}</span> vs banks & airports
                </span>
              </motion.div>
            )}

            <div className="space-y-2">
              <Button
                type="submit"
                disabled={isPending || !amount || !activeRate}
                className="w-full h-12 rounded-md text-[15px] font-bold bg-[#FFB427] hover:bg-[#e6a223] text-white uppercase tracking-wider border-0 shadow-none ring-0 outline-none focus:ring-0 focus-visible:ring-0"
                data-testid="button-submit"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Book This Order
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-4 pt-1" data-testid="trust-badges">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#FFB427]" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Zero Forex Markup</span>
                </div>
                <div className="w-px h-3 bg-gray-300" />
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">RBI Authorized</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400" data-testid="text-last-updated">
              <Clock className="w-3 h-3" />
              <span>
                Live rates updated{" "}
                {ratesData
                  ? new Date(ratesData.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '...'}
              </span>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
