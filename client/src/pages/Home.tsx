import { ForexWidget } from "@/components/ForexWidget";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-slate-50 relative selection:bg-primary/20">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-200/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-200/20 blur-[100px] rounded-full mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-8 lg:py-16 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 min-h-[calc(100vh-64px)]">
        
        {/* Left Content (Desktop) / Top Content (Mobile) */}
        <div className="flex-1 max-w-2xl text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
              <Zap className="w-3.5 h-3.5 fill-current" />
              India's Most Trusted Forex Platform
            </span>
            
            <h1 className="text-4xl lg:text-6xl font-display font-bold leading-[1.1] tracking-tight text-foreground">
              Exchange Currency <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Without the Hassle
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Get the best exchange rates in your city. Whether you need cash currency or a forex card, we deliver directly to your doorstep with zero hidden fees.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              { title: "Best Rate Guarantee", desc: "We beat bank rates, every time." },
              { title: "Doorstep Delivery", desc: "Safe delivery to your home or office." },
              { title: "100% Genuine Notes", desc: "Verified currency with receipts." },
              { title: "Same Day Service", desc: "Available in select metro cities." },
            ].map((feature, i) => (
              <div key={i} className="flex gap-3 p-4 rounded-xl bg-white/50 border border-white/40 shadow-sm backdrop-blur-sm hover:bg-white/80 transition-colors">
                <div className="mt-1">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              RBI Authorized Dealer
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div>2M+ Happy Customers</div>
          </div>
        </div>

        {/* Right Content - The Widget */}
        <div className="w-full max-w-md relative">
          {/* Floating badge for decoration */}
          <div className="absolute -top-6 -right-6 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 hidden lg:block animate-bounce duration-[3000ms]">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <span className="text-xl">🇺🇸</span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-medium">USD Rate</div>
                <div className="text-sm font-bold text-green-600">▼ Lowest Today</div>
              </div>
            </div>
          </div>

          <ForexWidget />
          
          <p className="text-center text-xs text-muted-foreground mt-6 max-w-xs mx-auto">
            By booking an order, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
