"use client";

import { CalendarIcon, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ChronoButton from "@chrono/chrono-button.component";
import { ChronoCalendar } from "@chrono/chrono-calendar.component";
import {
  ChronoPopover,
  ChronoPopoverContent,
  ChronoPopoverTrigger,
} from "@chrono/chrono-popover.component";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

export function DateRangePickerComponent() {
  const { replace } = useRouter();

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    const params = new URLSearchParams(window.location.search);
    const fromParam = params.get("startDate");
    const toParam = params.get("endDate");

    let from: Date | undefined;
    let to: Date | undefined;

    if (fromParam) {
      const parsedFrom = new Date(fromParam);
      if (!Number.isNaN(parsedFrom.getTime())) {
        from = parsedFrom;
      }
    }

    if (toParam) {
      const parsedTo = new Date(toParam);
      if (!Number.isNaN(parsedTo.getTime())) {
        to = parsedTo;
      }
    }

    return from || to ? { from, to } : undefined;
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSelectRange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const clearDateRange = () => {
    setDateRange(undefined);
    setIsPickerOpen(false);
  };

  const updateUrlParams = useCallback(
    (range: DateRange | undefined) => {
      const params = new URLSearchParams(window.location.search);

      if (range?.from) {
        params.set("startDate", format(range.from, "yyyy-MM-dd"));
      } else {
        params.delete("startDate");
      }

      if (range?.to) {
        params.set("endDate", format(range.to, "yyyy-MM-dd"));
      } else {
        params.delete("endDate");
      }

      // Reset to page 1 when date changes
      params.delete("page");

      const newUrl =
        window.location.pathname +
        "?" +
        params.toString() +
        window.location.hash;
      replace(newUrl);
    },
    [replace]
  );

  useEffect(() => {
    updateUrlParams(dateRange);
  }, [dateRange, updateUrlParams]);

  const formatDateRange = () => {
    if (!dateRange?.from) {
      return "Seleccionar rango de fechas";
    }

    if (!dateRange.to) {
      return format(dateRange.from, "d 'de' MMM, yyyy", { locale: es });
    }

    return `${format(dateRange.from, "d MMM", { locale: es })} - ${format(dateRange.to, "d MMM, yyyy", { locale: es })}`;
  };

  return (
    <div className="flex items-center gap-2">
      <ChronoPopover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <ChronoPopoverTrigger asChild>
          <ChronoButton
            type="button"
            variant="outline"
            className={cn(
              "min-w-[280px] h-9 justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </ChronoButton>
        </ChronoPopoverTrigger>
        <ChronoPopoverContent className="w-auto p-0" align="center">
          <ChronoCalendar
            mode="range"
            selected={dateRange}
            onSelect={handleSelectRange}
            numberOfMonths={2}
            defaultMonth={dateRange?.from ?? new Date()}
            initialFocus
          />
        </ChronoPopoverContent>
      </ChronoPopover>

      <ChronoButton
        type="button"
        variant="ghost"
        className="h-9 w-9"
        onClick={clearDateRange}
        disabled={!dateRange}
      >
        <X className="h-4 w-4" />
      </ChronoButton>
    </div>
  );
}
