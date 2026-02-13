import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Zap, Shield, TrendingDown, Clock, Timer, Truck, ChevronDown, IndianRupee } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useRates, useCreateLead } from "@/hooks/use-forex";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CitySelector } from "./CitySelector";
import deliveryIcon from "@assets/image_1770969428621.png";

const CARD_MIN_LOAD: Record<string, string> = {
  USD: "Start with just 10 USD, top up later",
  AED: "Start with just 40 AED, top up later",
  THB: "Start with just 350 THB, top up later",
  EUR: "Start with just 10 EUR, top up later",
  SGD: "Start with just 15 SGD, top up later",
  GBP: "Start with just 10 GBP, top up later",
  HKD: "Start with just 75 HKD, top up later",
  CHF: "Start with just 10 CHF, top up later",
  SAR: "Start with just 40 SAR, top up later",
  CAD: "Start with just 15 CAD, top up later",
  ZAR: "Start with just 150 ZAR, top up later",
  AUD: "Start with just 15 AUD, top up later",
  JPY: "Start with just 10,000 JPY, top up later",
  NZD: "Start with just 15 NZD, top up later",
};

function useCountdown() {
  const [minutes, setMinutes] = React.useState(14);
  const [seconds, setSeconds] = React.useState(59);
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s === 0) {
          setMinutes((m) => {
            if (m === 0) return 14;
            return m - 1;
          });
          return 59;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return { minutes, seconds };
}

function getDeliveryTat() {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 13) {
    return { text: "Order now & get it today!", isSameDay: true };
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formatted = tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return { text: `Delivery by ${formatted} (tomorrow)`, isSameDay: false };
}

export function ForexWidget() {
  const [location] = useLocation();
  const search = useSearch();

  const searchParams = new URLSearchParams(search);
  const defaultCity = searchParams.get("city")?.toUpperCase().slice(0, 3) || "DEL";

  const [product, setProduct] = React.useState<"note" | "card">("note");
  const [city, setCity] = React.useState(defaultCity);
  const [currency, setCurrency] = React.useState("USD");
  const [amount, setAmount] = React.useState<number | "">(1000);
  const [pulseButton, setPulseButton] = React.useState(true);

  const { data: ratesData, isLoading: isLoadingRates } = useRates(city);
  const { mutate: createLead, isPending } = useCreateLead();
  const { toast } = useToast();

  const countdown = useCountdown();
  const deliveryTat = getDeliveryTat();

  const selectedRate = ratesData?.rates.find((r) => r.currency === currency);
  const activeRate = selectedRate ? (product === "card" ? selectedRate.cardRate : selectedRate.notesRate) : 0;
  const convertedAmount = amount && activeRate ? (Number(amount) * activeRate).toFixed(2) : null;

  const savings = amount && activeRate ? (Number(amount) * activeRate * 0.035).toFixed(0) : null;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPulseButton((p) => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const persuasionText = product === "card"
    ? (CARD_MIN_LOAD[currency] || null)
    : "RBI Authorized Dealers";

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
      className="w-full max-w-none md:max-w-[420px] mx-auto"
    >
      <div className="bg-white md:rounded-md md:shadow-lg md:border md:border-gray-200 overflow-visible relative min-h-screen md:min-h-0">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 hidden md:block">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md whitespace-nowrap"
            data-testid="badge-limited"
          >
            Limited Time Offer
          </motion.div>
        </div>

        <div className="bg-[#093562] px-4 sm:px-5 pt-5 sm:pt-6 pb-3 md:rounded-t-md">
          <div className="md:hidden mb-2">
            <motion.span
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-block bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md whitespace-nowrap"
              data-testid="badge-limited-mobile"
            >
              Limited Time Offer
            </motion.span>
          </div>
          <h2 className="text-xl sm:text-lg font-semibold text-white" data-testid="text-widget-title">Buy Forex Online</h2>
          <div className="flex items-center gap-3 sm:gap-4 mt-2 flex-wrap" data-testid="header-callouts">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-[#FFB427]" />
              <span className="text-[13px] text-white font-semibold">Best Rates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#FFB427]" />
              <span className="text-[13px] text-white font-semibold">Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#FFB427]" />
              <span className="text-[13px] text-white font-semibold">Pay on Delivery</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex rounded-md border border-gray-300 overflow-hidden" data-testid="tabs-product">
              <button
                type="button"
                onClick={() => setProduct("note")}
                className={`flex-1 py-3 sm:py-2.5 text-sm font-medium transition-colors ${
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
                className={`flex-1 py-3 sm:py-2.5 text-sm font-medium transition-colors border-l border-gray-300 ${
                  product === "card"
                    ? "bg-[#093562] text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
                data-testid="tab-card"
              >
                Forex Card
              </button>
            </div>

            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-md px-3 py-2" data-testid="delivery-tat-bar">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-[12px] text-blue-800 font-semibold" data-testid="delivery-tat">
                  {deliveryTat.text}
                </span>
              </div>
              <CitySelector value={city} onChange={setCity} compact />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 block">Currency</label>
              <Select value={currency} onValueChange={setCurrency} disabled={isLoadingRates}>
                <SelectTrigger className="h-11 sm:h-10 rounded-md bg-white border-gray-300 text-sm" data-testid="select-currency">
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
                  className="w-full h-13 sm:h-12 rounded-md bg-white border border-gray-300 text-base font-semibold pl-3 pr-3 focus:outline-none focus:ring-2 focus:ring-[#093562]/30 focus:border-[#093562] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              <motion.div
                animate={pulseButton ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
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
              </motion.div>

              <div className="flex items-center justify-center gap-3 pt-1 flex-wrap" data-testid="trust-badges">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#FFB427]" />
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Zero Forex Markup</span>
                </div>
                {persuasionText && (
                  <>
                    <div className="w-px h-3 bg-gray-300" />
                    <div className="flex items-center gap-1" data-testid="persuasion-text">
                      {product === "card" ? (
                        <Zap className="w-3 h-3 text-[#FFB427] flex-shrink-0" />
                      ) : (
                        <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />
                      )}
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">{persuasionText}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-md px-3 py-2 text-center" data-testid="urgency-banner">
              <span className="text-[11px] text-orange-700 font-medium">
                Rate locked for <span className="font-bold font-mono">{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}</span> min - Book now before it changes!
              </span>
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
