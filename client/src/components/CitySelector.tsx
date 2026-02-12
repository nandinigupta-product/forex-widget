import * as React from "react";
import { Check, ChevronsUpDown, MapPin, Building2 } from "lucide-react";
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
}

export function CitySelector({ value, onChange }: CitySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const { data: cities = [], isLoading } = useCities();

  const selectedCity = cities.find((city) => city.code === value);

  // Group cities
  const topCities = cities.filter((c) => c.isTopCity);
  const otherCities = cities.filter((c) => !c.isTopCity);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        Select City
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 text-base rounded-xl border-border/60 hover:border-primary/50 bg-background shadow-sm transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="text-muted-foreground">Loading cities...</span>
            ) : selectedCity ? (
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {selectedCity.name}
              </span>
            ) : (
              <span className="text-muted-foreground">Select a city...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 rounded-xl shadow-xl border-border/60" align="start">
          <Command className="rounded-xl">
            <CommandInput placeholder="Search city..." className="h-11" />
            <CommandList className="max-h-[300px] scrollbar-thin">
              <CommandEmpty>No city found.</CommandEmpty>
              
              {topCities.length > 0 && (
                <CommandGroup heading="Top Cities" className="text-primary font-medium">
                  {topCities.map((city) => (
                    <CommandItem
                      key={city.code}
                      value={city.name}
                      onSelect={() => {
                        onChange(city.code);
                        setOpen(false);
                      }}
                      className="cursor-pointer aria-selected:bg-primary/10 aria-selected:text-primary py-2.5"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-primary",
                          value === city.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {city.name}
                      {city.aliases.length > 0 && (
                        <span className="ml-2 text-xs text-muted-foreground hidden sm:inline-block">
                          ({city.code.toUpperCase()})
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {otherCities.length > 0 && (
                <>
                  <div className="h-px bg-border/50 mx-2 my-1" />
                  <CommandGroup heading="Other Cities">
                    {otherCities.map((city) => (
                      <CommandItem
                        key={city.code}
                        value={city.name} // Search by name
                        onSelect={() => {
                          onChange(city.code);
                          setOpen(false);
                        }}
                        className="cursor-pointer aria-selected:bg-muted py-2.5"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-primary",
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
    </div>
  );
}
