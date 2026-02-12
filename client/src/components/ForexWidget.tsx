import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RefreshCw, Clock } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useRates, useCreateLead } from "@/hooks/use-forex";

import { Input } from "@/components/ui/input";
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
        <div className="bg-[#009688] px-5 py-4">
          <h2 className="text-lg font-semibold text-white" data-testid="text-widget-title">Buy Forex Online</h2>
          <p className="text-teal-100 text-xs mt-0.5">Best rates guaranteed, delivered to your door.</p>
        </div>

        <div className="p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex rounded-md border border-gray-300 overflow-hidden" data-testid="tabs-product">
              <button
                type="button"
                onClick={() => setProduct("note")}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  product === "note"
                    ? "bg-[#009688] text-white"
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
                    ? "bg-[#009688] text-white"
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

            <div className="grid grid-cols-[1fr,1.5fr] gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Currency</label>
                <Select value={currency} onValueChange={setCurrency} disabled={isLoadingRates}>
                  <SelectTrigger className="h-10 rounded-md bg-white border-gray-300 text-sm" data-testid="select-currency">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border-gray-300 shadow-lg max-h-[280px]">
                    {ratesData?.rates.map((rate) => (
                      <SelectItem key={rate.currency} value={rate.currency} className="cursor-pointer py-2 text-sm">
                        <span className="flex items-center gap-2">
                          {rate.image && <img src={rate.image} alt={rate.currency} className="w-5 h-3.5 object-cover rounded-sm" />}
                          <span>{rate.currency}</span>
                          <span className="text-gray-400 text-xs">{rate.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Amount</label>
                <Input
                  type="number"
                  placeholder="1000"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                  className="h-10 rounded-md bg-white border-gray-300 text-sm font-medium"
                  data-testid="input-amount"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedRate && activeRate > 0 && (
                <motion.div
                  key={`${currency}-${product}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-md bg-[#e0f2f1] border border-[#b2dfdb] p-3.5 space-y-2"
                  data-testid="rate-display"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">
                      Rate ({product === "card" ? "Forex Card" : "Cash Notes"})
                    </span>
                    <span className="text-sm font-semibold text-[#00796b] bg-white/70 px-2 py-0.5 rounded" data-testid="text-rate">
                      1 {currency} = ₹{activeRate.toFixed(4)}
                    </span>
                  </div>

                  {convertedAmount && (
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-gray-500">You Pay (Approx)</span>
                      <span className="text-xl font-bold text-[#00796b]" data-testid="text-converted-amount">
                        ₹{Number(convertedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={isPending || !amount || !activeRate}
              className="w-full h-11 rounded-md text-sm font-semibold bg-[#009688] hover:bg-[#00796b] text-white uppercase tracking-wide"
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
