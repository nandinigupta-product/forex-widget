import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Banknote, CreditCard, RefreshCw, AlertCircle } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useRates, useCreateLead } from "@/hooks/use-forex";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CitySelector } from "./CitySelector";

export function ForexWidget() {
  const [location] = useLocation();
  const search = useSearch(); // Returns query string like "city=bangalore"
  
  // Parse query params for default city
  const searchParams = new URLSearchParams(search);
  const defaultCity = searchParams.get("city")?.toLowerCase().slice(0, 3) || "del";

  // Form State
  const [product, setProduct] = React.useState<"note" | "card">("note");
  const [city, setCity] = React.useState(defaultCity);
  const [currency, setCurrency] = React.useState("USD");
  const [amount, setAmount] = React.useState<number | "">("");

  // Hooks
  const { data: ratesData, isLoading: isLoadingRates } = useRates();
  const { mutate: createLead, isPending } = useCreateLead();
  const { toast } = useToast();

  // Derived State
  const selectedRate = ratesData?.rates.find((r) => r.currency === currency);
  const convertedAmount = amount && selectedRate ? (Number(amount) * selectedRate.rate).toFixed(2) : null;

  // Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !selectedRate) return;

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm ring-1 ring-black/5 rounded-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-display font-bold mb-1">Buy Forex Online</h2>
            <p className="text-blue-100 text-sm font-medium">Best rates guaranteed, delivered to your door.</p>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute left-0 bottom-0 w-24 h-24 bg-blue-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
        </div>

        <div className="p-6 space-y-6">
          <Tabs 
            defaultValue="note" 
            value={product} 
            onValueChange={(v) => setProduct(v as "note" | "card")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl h-12 mb-6">
              <TabsTrigger 
                value="note"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all"
              >
                <Banknote className="w-4 h-4 mr-2" />
                Currency Notes
              </TabsTrigger>
              <TabsTrigger 
                value="card"
                className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-medium transition-all"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Forex Card
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* City Selection */}
              <CitySelector value={city} onChange={setCity} />

              {/* Currency & Amount Row */}
              <div className="grid grid-cols-[1fr,1.5fr] gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Currency</label>
                  <Select value={currency} onValueChange={setCurrency} disabled={isLoadingRates}>
                    <SelectTrigger className="h-12 rounded-xl bg-background border-border/60 hover:border-primary/50">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/60 shadow-xl max-h-[300px]">
                      {ratesData?.rates.map((rate) => (
                        <SelectItem key={rate.currency} value={rate.currency} className="cursor-pointer py-3">
                          <span className="flex items-center gap-2 font-medium">
                            <span className="w-6 text-center text-lg">{rate.symbol}</span>
                            {rate.currency}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="1000"
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                      className="h-12 rounded-xl pl-4 pr-4 bg-background border-border/60 hover:border-primary/50 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-mono text-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Live Rate Display */}
              <AnimatePresence mode="wait">
                {selectedRate && (
                  <motion.div
                    key={currency}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 space-y-1"
                  >
                    <div className="flex justify-between items-center text-sm text-blue-600/80">
                      <span className="font-medium">Exchange Rate</span>
                      <span className="font-mono bg-blue-100/50 px-2 py-0.5 rounded text-xs">
                        1 {currency} = ₹{selectedRate.rate}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-sm text-muted-foreground">You Pay (Approx)</span>
                      <span className="text-2xl font-display font-bold text-foreground">
                        ₹{convertedAmount || "0.00"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending || !amount || !selectedRate}
                className="w-full h-14 rounded-xl text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Book Order Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Live rates updated {ratesData ? new Date(ratesData.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) : '...'}</span>
              </div>
            </form>
          </Tabs>
        </div>
      </Card>
    </motion.div>
  );
}
