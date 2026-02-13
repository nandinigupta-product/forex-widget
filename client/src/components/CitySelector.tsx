import * as React from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCities } from "@/hooks/use-forex";

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export function CitySelector({ value, onChange, compact }: CitySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { data: cities = [], isLoading } = useCities();

  const selectedCity = cities.find((city) => city.code === value);

  const topCities = cities.filter((c) => c.isTopCity);
  const otherCities = cities.filter((c) => !c.isTopCity);

  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 text-blue-600 font-semibold text-[13px] hover:text-blue-700 transition-colors flex-shrink-0"
            data-testid="select-city"
          >
            {isLoading ? "..." : selectedCity?.name || "Select City"}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0 rounded-md shadow-lg border-gray-200" align="end">
          <Command className="rounded-md">
            <CommandInput placeholder="Search city..." className="h-10 text-sm" />
            <CommandList className="max-h-[260px] scrollbar-thin">
              <CommandEmpty>No city found.</CommandEmpty>
              {topCities.length > 0 && (
                <CommandGroup heading="Top Cities">
                  {topCities.map((city) => (
                    <CommandItem
                      key={city.code}
                      value={`${city.name} ${city.aliases.join(" ")}`}
                      onSelect={() => {
                        onChange(city.code);
                        setOpen(false);
                      }}
                      className="cursor-pointer py-2 text-sm"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3.5 w-3.5 text-[#009688]",
                          value === city.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {otherCities.length > 0 && (
                <>
                  <div className="h-px bg-gray-100 mx-2 my-1" />
                  <CommandGroup heading="Other Cities">
                    {otherCities.map((city) => (
                      <CommandItem
                        key={city.code}
                        value={`${city.name} ${city.aliases.join(" ")}`}
                        onSelect={() => {
                          onChange(city.code);
                          setOpen(false);
                        }}
                        className="cursor-pointer py-2 text-sm"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-3.5 w-3.5 text-[#009688]",
                            value === city.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {city.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-10 text-sm rounded-md border-gray-300 bg-white shadow-none font-normal"
          disabled={isLoading}
          data-testid="select-city"
        >
          {isLoading ? (
            <span className="text-gray-400">Loading cities...</span>
          ) : selectedCity ? (
            <span className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-3.5 h-3.5 text-[#009688]" />
              {selectedCity.name}
            </span>
          ) : (
            <span className="text-gray-400">Select a city...</span>
          )}
          <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 rounded-md shadow-lg border-gray-200" align="start">
        <Command className="rounded-md">
          <CommandInput placeholder="Search city..." className="h-10 text-sm" />
          <CommandList className="max-h-[260px] scrollbar-thin">
            <CommandEmpty>No city found.</CommandEmpty>

            {topCities.length > 0 && (
              <CommandGroup heading="Top Cities">
                {topCities.map((city) => (
                  <CommandItem
                    key={city.code}
                    value={`${city.name} ${city.aliases.join(" ")}`}
                    onSelect={() => {
                      onChange(city.code);
                      setOpen(false);
                    }}
                    className="cursor-pointer py-2 text-sm"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3.5 w-3.5 text-[#009688]",
                        value === city.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {otherCities.length > 0 && (
              <>
                <div className="h-px bg-gray-100 mx-2 my-1" />
                <CommandGroup heading="Other Cities">
                  {otherCities.map((city) => (
                    <CommandItem
                      key={city.code}
                      value={`${city.name} ${city.aliases.join(" ")}`}
                      onSelect={() => {
                        onChange(city.code);
                        setOpen(false);
                      }}
                      className="cursor-pointer py-2 text-sm"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3.5 w-3.5 text-[#009688]",
                          value === city.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
