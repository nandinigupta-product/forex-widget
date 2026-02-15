import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Currency {
  code: string;
  name: string;
  popular: boolean;
  rightLabel: string;
  searchTerms: string;
}

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  rates: Array<{ currency: string; name: string; image?: string }>;
  disabled?: boolean;
}

const CURRENCY_METADATA: Currency[] = [
  {
    code: "USD",
    name: "US Dollar",
    popular: true,
    rightLabel: "USA, Maldives + 170 countries",
    searchTerms: "usd us dollar usa america united states new york los angeles chicago washington san francisco",
  },
  {
    code: "THB",
    name: "Thai Baht",
    popular: true,
    rightLabel: "Thailand",
    searchTerms: "thb thai baht thailand bangkok chiang mai phuket pattaya krabi ayutthaya hua hin samui chiang rai sukhothai",
  },
  {
    code: "AED",
    name: "UAE Dirham",
    popular: true,
    rightLabel: "United Arab Emirates",
    searchTerms: "aed uae dirham dubai abu dhabi sharjah ajman fujairah ras al khaimah umm al quwain united arab emirates",
  },
  {
    code: "EUR",
    name: "Euro",
    popular: true,
    rightLabel: "France, Germany + 45 countries",
    searchTerms: "eur euro europe france germany italy spain paris rome berlin amsterdam barcelona vienna prague brussels athens lisbon dublin helsinki stockholm copenhagen european union",
  },
  {
    code: "SGD",
    name: "Singapore Dollar",
    popular: true,
    rightLabel: "Singapore",
    searchTerms: "sgd singapore dollar sing jurong east woodlands tampines changi bukit timah marina bay sentosa orchard road",
  },
  {
    code: "MYR",
    name: "Malaysian Ringgit",
    popular: true,
    rightLabel: "Malaysia",
    searchTerms: "myr malaysian ringgit ringgits malaysia kuala lumpur langkawi penang",
  },
  {
    code: "IDR",
    name: "Indonesian Rupiah",
    popular: true,
    rightLabel: "Indonesia",
    searchTerms: "idr indonesian rupiah indonesia bali jakarta",
  },
  {
    code: "GBP",
    name: "British Pound",
    popular: true,
    rightLabel: "United Kingdom (UK)",
    searchTerms: "gbp british pound uk united kingdom britain england london birmingham glasgow manchester edinburgh liverpool bristol sheffield leeds sterling",
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    popular: true,
    rightLabel: "Japan",
    searchTerms: "jpy japanese yen japan tokyo yokohama osaka nagoya sapporo kobe kyoto fukuoka hiroshima",
  },
  {
    code: "VND",
    name: "Vietnamese Dong",
    popular: true,
    rightLabel: "Vietnam",
    searchTerms: "vnd vietnam dong vietnamese hanoi ho chi minh city saigon da nang ha long bay",
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    popular: false,
    rightLabel: "Australia",
    searchTerms: "aud australian dollar australia sydney melbourne brisbane aussie",
  },
  {
    code: "BDT",
    name: "Bangladesh Taka",
    popular: false,
    rightLabel: "Bangladesh",
    searchTerms: "bdt bangladesh taka dhaka chittagong",
  },
  {
    code: "BHD",
    name: "Bahraini Dinar",
    popular: false,
    rightLabel: "Bahrain",
    searchTerms: "bhd bahraini dinar bahrain manama",
  },
  {
    code: "BRL",
    name: "Brazilian Real",
    popular: false,
    rightLabel: "Brazil",
    searchTerms: "brl brazilian real brazil rio de janeiro sao paulo são paulo",
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    popular: false,
    rightLabel: "Canada",
    searchTerms: "cad canadian dollar canada toronto vancouver montreal",
  },
  {
    code: "CNY",
    name: "Chinese Yuan",
    popular: false,
    rightLabel: "China",
    searchTerms: "cny chinese yuan china beijing shanghai guangzhou rmb renminbi",
  },
  {
    code: "CZK",
    name: "Czech Koruna",
    popular: false,
    rightLabel: "Czech Republic",
    searchTerms: "czk czech koruna czech republic prague",
  },
  {
    code: "DKK",
    name: "Danish Krone",
    popular: false,
    rightLabel: "Denmark",
    searchTerms: "dkk danish krone denmark copenhagen",
  },
  {
    code: "EGP",
    name: "Egyptian Pound",
    popular: false,
    rightLabel: "Egypt",
    searchTerms: "egp egyptian pound egypt cairo alexandria sharm el-sheikh",
  },
  {
    code: "HKD",
    name: "Hong Kong Dollar",
    popular: false,
    rightLabel: "Hong Kong",
    searchTerms: "hkd hong kong dollar hk",
  },
  {
    code: "ILS",
    name: "Israeli Shekel",
    popular: false,
    rightLabel: "Israel",
    searchTerms: "ils israeli shekel israel tel aviv jerusalem",
  },
  {
    code: "KES",
    name: "Kenyan Shilling",
    popular: false,
    rightLabel: "Kenya",
    searchTerms: "kes kenyan shilling kenya nairobi mombasa",
  },
  {
    code: "KRW",
    name: "Korean Won",
    popular: false,
    rightLabel: "South Korea",
    searchTerms: "krw korean won south korea seoul busan jeju",
  },
  {
    code: "KWD",
    name: "Kuwaiti Dinar",
    popular: false,
    rightLabel: "Kuwait",
    searchTerms: "kwd kuwaiti dinar kuwait kuwait city",
  },
  {
    code: "MOP",
    name: "Macau Pataca",
    popular: false,
    rightLabel: "Macau",
    searchTerms: "mop macau pataca casinos",
  },
  {
    code: "MVR",
    name: "Maldivian Rufiyaa",
    popular: false,
    rightLabel: "Maldives",
    searchTerms: "mvr maldivian rufiyaa maldives male resort islands",
  },
  {
    code: "MUR",
    name: "Mauritius Rupee",
    popular: false,
    rightLabel: "Mauritius",
    searchTerms: "mur mauritius rupee port louis grand baie",
  },
  {
    code: "NZD",
    name: "New Zealand Dollar",
    popular: false,
    rightLabel: "New Zealand",
    searchTerms: "nzd new zealand dollar auckland queenstown wellington kiwi",
  },
  {
    code: "NOK",
    name: "Norwegian Krone",
    popular: false,
    rightLabel: "Norway",
    searchTerms: "nok norwegian krone norway oslo bergen",
  },
  {
    code: "OMR",
    name: "Omani Rial",
    popular: false,
    rightLabel: "Oman",
    searchTerms: "omr omani rial oman muscat salalah riyal",
  },
  {
    code: "PHP",
    name: "Philippine Peso",
    popular: false,
    rightLabel: "Philippines",
    searchTerms: "php philippine peso philippines manila cebu boracay",
  },
  {
    code: "PLN",
    name: "Polish Zloty",
    popular: false,
    rightLabel: "Poland",
    searchTerms: "pln polish zloty poland warsaw krakow",
  },
  {
    code: "QAR",
    name: "Qatari Rial",
    popular: false,
    rightLabel: "Qatar",
    searchTerms: "qar qatari rial qatar doha riyal",
  },
  {
    code: "RUB",
    name: "Russian Ruble",
    popular: false,
    rightLabel: "Russia",
    searchTerms: "rub russian ruble russia moscow st petersburg saint petersburg",
  },
  {
    code: "SAR",
    name: "Saudi Riyal",
    popular: false,
    rightLabel: "Saudi Arabia",
    searchTerms: "sar saudi riyal saudi arabia riyadh jeddah mecca medina ksa",
  },
  {
    code: "ZAR",
    name: "South African Rand",
    popular: false,
    rightLabel: "South Africa",
    searchTerms: "zar south african rand south africa cape town johannesburg durban",
  },
  {
    code: "LKR",
    name: "Sri Lankan Rupee",
    popular: false,
    rightLabel: "Sri Lanka",
    searchTerms: "lkr sri lankan rupee sri lanka colombo kandy galle",
  },
  {
    code: "SEK",
    name: "Swedish Krona",
    popular: false,
    rightLabel: "Sweden",
    searchTerms: "sek swedish krona sweden stockholm gothenburg",
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    popular: false,
    rightLabel: "Switzerland",
    searchTerms: "chf swiss franc switzerland zurich geneva interlaken lucerne",
  },
  {
    code: "TRY",
    name: "Turkish Lira",
    popular: false,
    rightLabel: "Turkey",
    searchTerms: "try turkish lira turkey istanbul antalya cappadocia",
  },
];

function fuzzyMatch(query: string, searchTerms: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const words = q.split(/\s+/);
  return words.every((word) => searchTerms.includes(word));
}

interface EnrichedCurrency extends Currency {
  image?: string;
}

function CurrencyItem({
  currency,
  isSelected,
  onSelect,
}: {
  currency: EnrichedCurrency;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="cursor-pointer py-2 px-2 text-sm flex items-center justify-between w-full rounded-sm hover:bg-gray-100 transition-colors"
      data-testid={`currency-item-${currency.code}`}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Check
          className={cn(
            "mr-1 h-3.5 w-3.5 text-[#009688] flex-shrink-0",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
        {currency.image && (
          <img
            src={currency.image}
            alt={currency.code}
            className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0"
          />
        )}
        <span className="truncate">{currency.name}</span>
      </div>
      <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2 truncate text-right max-w-[140px]">
        {currency.rightLabel}
      </span>
    </button>
  );
}

export function CurrencySelector({
  value,
  onChange,
  rates,
  disabled,
}: CurrencySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const availableCurrencyCodes = new Set(rates.map((r) => r.currency));
  const ratesByCode = new Map(rates.map((r) => [r.currency, r]));

  const enrichedCurrencies = React.useMemo(() =>
    CURRENCY_METADATA.filter((c) =>
      availableCurrencyCodes.has(c.code)
    ).map((c) => ({
      ...c,
      image: ratesByCode.get(c.code)?.image,
    })),
    [rates]
  );

  const isSearching = search.trim().length > 0;

  const filtered = React.useMemo(() => {
    if (!isSearching) return enrichedCurrencies;
    return enrichedCurrencies.filter((c) => fuzzyMatch(search, c.searchTerms));
  }, [search, enrichedCurrencies, isSearching]);

  const popularCurrencies = enrichedCurrencies.filter((c) => c.popular);
  const otherCurrencies = enrichedCurrencies
    .filter((c) => !c.popular)
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectedCurrency = enrichedCurrencies.find((c) => c.code === value);

  const handleSelect = (code: string) => {
    onChange(code);
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (!o) setSearch(""); }}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 text-sm rounded-md border-gray-300 bg-white shadow-none font-normal"
          disabled={disabled}
          data-testid="select-currency"
        >
          {selectedCurrency ? (
            <span className="flex items-center gap-2 text-gray-700 truncate">
              {selectedCurrency.image && (
                <img
                  src={selectedCurrency.image}
                  alt={selectedCurrency.code}
                  className="w-5 h-3.5 object-cover rounded-sm flex-shrink-0"
                />
              )}
              <span className="truncate">{selectedCurrency.name}</span>
            </span>
          ) : (
            <span className="text-gray-400">Select a currency...</span>
          )}
          <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[340px] p-0 rounded-md shadow-lg border-gray-200"
        align="start"
      >
        <div className="flex items-center border-b px-3 gap-2">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by currency, country or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full text-sm bg-transparent outline-none placeholder:text-gray-400"
            data-testid="input-currency-search"
            autoFocus
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-1 scrollbar-thin">
          {isSearching ? (
            filtered.length > 0 ? (
              <div>
                <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Search Results</div>
                {filtered.map((currency) => (
                  <CurrencyItem
                    key={currency.code}
                    currency={currency}
                    isSelected={value === currency.code}
                    onSelect={() => handleSelect(currency.code)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-gray-500">No currency found.</div>
            )
          ) : (
            <>
              {popularCurrencies.length > 0 && (
                <div>
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Popular Currencies</div>
                  {popularCurrencies.map((currency) => (
                    <CurrencyItem
                      key={currency.code}
                      currency={currency}
                      isSelected={value === currency.code}
                      onSelect={() => handleSelect(currency.code)}
                    />
                  ))}
                </div>
              )}
              {otherCurrencies.length > 0 && (
                <>
                  <div className="h-px bg-gray-100 mx-2 my-1" />
                  <div>
                    <div className="px-2 py-1.5 text-xs font-medium text-gray-500">All Currencies</div>
                    {otherCurrencies.map((currency) => (
                      <CurrencyItem
                        key={currency.code}
                        currency={currency}
                        isSelected={value === currency.code}
                        onSelect={() => handleSelect(currency.code)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
