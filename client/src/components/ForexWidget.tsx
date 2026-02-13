import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, RefreshCw, Zap, Shield, TrendingDown, Clock, Timer, Truck, ChevronDown, IndianRupee, CreditCard, Banknote, Tag, BadgePercent, Copy, Check } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useRates, useCreateLead, useBetterRate } from "@/hooks/use-forex";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CitySelector } from "./CitySelector";
import deliveryIcon from "@assets/image_1770969428621.png";

const CARD_MIN_LOAD: Record<string, string> = {
  USD: "Start with just 10 USD",
  AED: "Start with just 40 AED",
  THB: "Start with just 350 THB",
  EUR: "Start with just 10 EUR",
  SGD: "Start with just 15 SGD",
  GBP: "Start with just 10 GBP",
  HKD: "Start with just 75 HKD",
  CHF: "Start with just 10 CHF",
  SAR: "Start with just 40 SAR",
  CAD: "Start with just 15 CAD",
  ZAR: "Start with just 150 ZAR",
  AUD: "Start with just 15 AUD",
  JPY: "Start with just 10,000 JPY",
  NZD: "Start with just 15 NZD",
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

const CURRENCY_SLUG_MAP: Record<string, string> = {
  "us-dollar": "USD", "usd": "USD", "dollar": "USD",
  "euro": "EUR", "eur": "EUR",
  "british-pound": "GBP", "gbp": "GBP", "pound": "GBP",
  "australian-dollar": "AUD", "aud": "AUD",
  "canadian-dollar": "CAD", "cad": "CAD",
  "singapore-dollar": "SGD", "sgd": "SGD",
  "new-zealand-dollar": "NZD", "nzd": "NZD",
  "hong-kong-dollar": "HKD", "hkd": "HKD",
  "uae-dirham": "AED", "aed": "AED", "dirham": "AED",
  "saudi-riyal": "SAR", "sar": "SAR", "riyal": "SAR",
  "swiss-franc": "CHF", "chf": "CHF",
  "japanese-yen": "JPY", "jpy": "JPY", "yen": "JPY",
  "swedish-krona": "SEK", "sek": "SEK",
  "thai-baht": "THB", "thb": "THB", "baht": "THB",
  "malaysian-ringgit": "MYR", "myr": "MYR", "ringgit": "MYR",
  "chinese-yuan": "CNY", "cny": "CNY", "yuan": "CNY",
  "south-african-rand": "ZAR", "zar": "ZAR", "rand": "ZAR",
  "omani-rial": "OMR", "omr": "OMR",
  "bahraini-dinar": "BHD", "bhd": "BHD",
  "kuwaiti-dinar": "KWD", "kwd": "KWD",
  "norwegian-krone": "NOK", "nok": "NOK",
  "danish-krone": "DKK", "dkk": "DKK",
  "indonesian-rupiah": "IDR", "idr": "IDR",
  "sri-lankan-rupee": "LKR", "lkr": "LKR",
  "korean-won": "KRW", "krw": "KRW",
  "turkish-lira": "TRY", "try": "TRY",
  "russian-ruble": "RUB", "rub": "RUB",
  "qatari-riyal": "QAR", "qar": "QAR",
  "philippine-peso": "PHP", "php": "PHP",
};

const CITY_SLUG_MAP: Record<string, string> = {
  "mumbai": "MUM", "delhi": "DEL", "new-delhi": "DEL", "bangalore": "BNG", "bengaluru": "BNG",
  "hyderabad": "HYD", "pune": "PUN", "chennai": "CHN", "gurgaon": "GUR", "gurugram": "GUR",
  "noida": "NOI", "kolkata": "KOL", "ahmedabad": "AHM", "jaipur": "JAI", "chandigarh": "CHA",
  "lucknow": "LKO", "indore": "IND", "kochi": "KOC", "cochin": "KOC", "goa": "GOA",
  "bhopal": "BHP", "nagpur": "NAG", "surat": "SUR", "vadodara": "VAD", "coimbatore": "COI",
  "visakhapatnam": "VSK", "vizag": "VSK", "trivandrum": "THI", "thiruvananthapuram": "THI",
  "mysore": "MYS", "mysuru": "MYS", "mangalore": "MNG", "mangaluru": "MNG",
  "bhubaneswar": "BHB", "patna": "PAT", "ranchi": "RAN", "guwahati": "GWH",
  "dehradun": "DEH", "amritsar": "AMR", "ludhiana": "LDH", "jalandhar": "JAL",
  "kanpur": "KNP", "varanasi": "VAR", "agra": "AGR", "meerut": "MRT",
  "faridabad": "FAR", "ghaziabad": "GHZ", "greater-noida": "GNO", "thane": "THA",
  "navi-mumbai": "NVM", "nashik": "NSK", "rajkot": "RJK", "madurai": "MAD",
  "jodhpur": "JOD", "raipur": "RAI", "gwalior": "GWL", "hubli": "HUBL",
  "belgaum": "BELG", "udaipur": "UDP", "jammu": "JAM", "shimla": "SHM",
  "pondicherry": "PDY", "puducherry": "PDY", "mohali": "MOH", "panchkula": "PCK",
  "siliguri": "SIL", "cuttack": "CUTT", "kolhapur": "KLH", "solapur": "SLP",
  "salem": "SAL", "thrissur": "TRI", "kozhikode": "KZH", "calicut": "KZH",
  "tiruchirappalli": "TIRU", "trichy": "TIRU", "tirupur": "TPR",
  "secunderabad": "SEC", "warangal": "WRG", "vijayawada": "VIJ", "guntur": "GUN",
};

function detectContextFromUrl(): { product?: "card" | "note" | "both"; city?: string; currency?: string } {
  const params = new URLSearchParams(window.location.search);
  const result: { product?: "card" | "note" | "both"; city?: string; currency?: string } = {};

  const productParam = params.get("product")?.toLowerCase();
  if (productParam === "card") result.product = "card";
  else if (productParam === "note") result.product = "note";
  else if (productParam === "both") result.product = "both";

  const cityParam = params.get("city")?.toUpperCase();
  if (cityParam) result.city = cityParam;

  const currencyParam = params.get("currency")?.toUpperCase();
  if (currencyParam) result.currency = currencyParam;

  const referrer = document.referrer || "";
  const widgetPath = window.location.pathname || "";
  const urlToCheck = referrer || widgetPath;

  if (urlToCheck) {
    const urlLower = urlToCheck.toLowerCase();

    if (!result.product) {
      if (urlLower.includes("/forex-card")) {
        result.product = "card";
      }
    }

    if (!result.city) {
      const ceMatch = urlLower.match(/\/currency-exchange\/([a-z-]+)\/?/);
      if (ceMatch && ceMatch[1]) {
        const slug = ceMatch[1];
        if (CITY_SLUG_MAP[slug]) {
          result.city = CITY_SLUG_MAP[slug];
        }
      }
    }

    if (!result.currency) {
      const converterMatch = urlLower.match(/\/currency-converter\/([a-z-]+)-to-inr/);
      if (converterMatch && converterMatch[1]) {
        const slug = converterMatch[1];
        if (CURRENCY_SLUG_MAP[slug]) {
          result.currency = CURRENCY_SLUG_MAP[slug];
        }
      }

      if (!result.currency) {
        const ratesMatch = urlLower.match(/\/([a-z-]+)\/rates\/?/);
        if (ratesMatch && ratesMatch[1]) {
          const slug = ratesMatch[1];
          if (CURRENCY_SLUG_MAP[slug]) {
            result.currency = CURRENCY_SLUG_MAP[slug];
          }
        }
      }
    }
  }

  return result;
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

function DiscountCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded px-2 py-1 transition-colors flex-shrink-0"
      data-testid="button-copy-discount"
      title="Copy discount code"
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy Code
        </>
      )}
    </button>
  );
}

export function ForexWidget() {
  const [location] = useLocation();
  const search = useSearch();

  const context = React.useMemo(() => detectContextFromUrl(), []);

  const showOnlyCard = context.product === "card";
  const showOnlyNote = context.product === "note";
  const showBothTabs = !showOnlyCard && !showOnlyNote;

  const defaultProduct = showOnlyCard ? "card" : "note";
  const defaultCity = context.city || "DEL";
  const defaultCurrency = context.currency || "USD";

  const [product, setProduct] = React.useState<"note" | "card">(defaultProduct);
  const [city, setCity] = React.useState(defaultCity);
  const [currency, setCurrency] = React.useState(defaultCurrency);
  const [amount, setAmount] = React.useState<number | "">(1000);
  const [pulseButton, setPulseButton] = React.useState(true);

  const { data: ratesData, isLoading: isLoadingRates } = useRates(city);
  const { mutate: createLead, isPending } = useCreateLead();
  const { toast } = useToast();

  const betterRateParams = amount && Number(amount) > 0 ? {
    amount: Number(amount),
    currencyCode: currency,
    product: product === "card" ? "PC" as const : "CN" as const,
    cityCode: city,
  } : null;
  const { data: betterRateData } = useBetterRate(betterRateParams);

  const countdown = useCountdown();
  const deliveryTat = getDeliveryTat();

  const selectedRate = ratesData?.rates.find((r) => r.currency === currency);
  const originalRate = selectedRate ? (product === "card" ? selectedRate.cardRate : selectedRate.notesRate) : 0;
  const hasDiscount = betterRateData && betterRateData.flatDiscount > 0 && betterRateData.discountCode;
  const activeRate = originalRate;
  const convertedAmount = amount && activeRate ? (Number(amount) * activeRate).toFixed(2) : null;
  const discountedTotal = hasDiscount && convertedAmount ? (Number(convertedAmount) - betterRateData.flatDiscount).toFixed(2) : null;

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
      className="w-full max-w-[420px] mx-auto"
    >
      <div className="bg-white rounded-md shadow-lg border border-gray-200 overflow-visible relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md whitespace-nowrap"
            data-testid="badge-limited"
          >
            Limited Time Offer
          </motion.div>
        </div>

        <div className="bg-[#093562] px-4 sm:px-5 pt-5 pb-3 rounded-t-md">
          <h2 className="text-lg font-semibold text-white" data-testid="text-widget-title">Buy Forex Online</h2>
          <div className="flex items-center justify-between mt-2" data-testid="header-callouts">
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFB427] flex-shrink-0" />
              <span className="text-[11px] sm:text-[13px] text-white font-semibold whitespace-nowrap">Best Rates</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFB427] flex-shrink-0" />
              <span className="text-[11px] sm:text-[13px] text-white font-semibold whitespace-nowrap">Doorstep Delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFB427] flex-shrink-0" />
              <span className="text-[11px] sm:text-[13px] text-white font-semibold whitespace-nowrap">Pay on Delivery</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {showBothTabs ? (
              <div className="flex rounded-md border border-gray-300 overflow-hidden" data-testid="tabs-product">
                <button
                  type="button"
                  onClick={() => setProduct("note")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center ${
                    product === "note"
                      ? "bg-[#093562] text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                  data-testid="tab-notes"
                >
                  <Banknote className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  Currency Notes
                </button>
                <button
                  type="button"
                  onClick={() => setProduct("card")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors border-l border-gray-300 flex items-center justify-center ${
                    product === "card"
                      ? "bg-[#093562] text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                  data-testid="tab-card"
                >
                  <CreditCard className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  Forex Card
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 bg-[#093562] text-white rounded-md py-2.5 text-sm font-medium" data-testid="tabs-product">
                {showOnlyCard ? (
                  <><CreditCard className="w-4 h-4 flex-shrink-0" /> Forex Card</>
                ) : (
                  <><Banknote className="w-4 h-4 flex-shrink-0" /> Currency Notes</>
                )}
              </div>
            )}

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
                  className="w-full h-12 rounded-md bg-white border border-gray-300 text-base font-semibold pl-3 pr-3 focus:outline-none focus:ring-2 focus:ring-[#093562]/30 focus:border-[#093562] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  data-testid="input-amount"
                />
                {selectedRate && activeRate > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-right" data-testid="rate-display">
                    <span className="text-[11px] text-gray-400 block leading-tight" data-testid="text-rate">
                      1 {currency} = ₹{activeRate.toFixed(2)}
                    </span>
                    {convertedAmount && (
                      <div className="leading-tight">
                        {hasDiscount && discountedTotal ? (
                          <>
                            <span className="text-[10px] text-gray-400 line-through" data-testid="text-original-total">
                              ₹{Number(convertedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-xs font-bold text-green-600 block" data-testid="text-converted-amount">
                              = ₹{Number(discountedTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-[#093562] block" data-testid="text-converted-amount">
                            = ₹{Number(convertedAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {hasDiscount && betterRateData.discountCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between bg-emerald-50 border border-emerald-200 border-dashed rounded-md px-3 py-2"
                data-testid="discount-banner"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Tag className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[11px] text-emerald-800 font-bold block leading-tight">
                      ₹{betterRateData.flatDiscount.toLocaleString('en-IN')} cashback applied
                    </span>
                    <span className="text-[10px] text-emerald-600 block leading-tight mt-0.5">
                      Discount applied on checkout
                    </span>
                  </div>
                </div>
                <DiscountCopyButton code={betterRateData.discountCode} />
              </motion.div>
            )}

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

              <div className="flex items-center justify-center gap-2 sm:gap-3 pt-1" data-testid="trust-badges">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Zap className="w-3 h-3 text-[#FFB427] flex-shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Zero Forex Markup</span>
                </div>
                {persuasionText && (
                  <>
                    <div className="w-px h-3 bg-gray-300 flex-shrink-0" />
                    <div className="flex items-center gap-1 min-w-0" data-testid="persuasion-text">
                      {product === "card" ? (
                        <CreditCard className="w-3 h-3 text-[#093562] flex-shrink-0" />
                      ) : (
                        <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />
                      )}
                      <span className="text-[9px] sm:text-[10px] font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap truncate">{persuasionText}</span>
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
