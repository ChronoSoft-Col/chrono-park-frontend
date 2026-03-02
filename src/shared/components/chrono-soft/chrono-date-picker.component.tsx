"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import ChronoButton from "./chrono-button.component";
import { cn } from "@/src/lib/utils";
import {
  ChronoPopover,
  ChronoPopoverContent,
  ChronoPopoverTrigger,
} from "./chrono-popover.component";
import { ChronoCalendar } from "./chrono-calendar.component";

export type ChronoDatePickerProps = {
  /** Selected date */
  date?: Date;
  /** Callback when date changes */
  onDateChange: (date: Date | undefined) => void;
  /** Placeholder text when no date selected */
  placeholder?: string;
  /** Date format string (date-fns) */
  dateFormat?: string;
  /** Disable the picker */
  disabled?: boolean;
  /** Additional className for the trigger button */
  className?: string;
  /** Disable dates before this date */
  fromDate?: Date;
  /** Disable dates after this date */
  toDate?: Date;
};

export function ChronoDatePicker({
  date,
  onDateChange,
  placeholder = "Seleccionar fecha",
  dateFormat = "dd 'de' MMMM, yyyy",
  disabled = false,
  className,
  fromDate,
  toDate,
}: ChronoDatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (disabled) return;
    onDateChange(selectedDate);
    setIsOpen(false);
  };

  return (
    <ChronoPopover
      open={isOpen}
      onOpenChange={(open: boolean) => !disabled && setIsOpen(open)}
    >
      <ChronoPopoverTrigger asChild>
        <ChronoButton
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, dateFormat, { locale: es })
          ) : (
            <span>{placeholder}</span>
          )}
        </ChronoButton>
      </ChronoPopoverTrigger>

      <ChronoPopoverContent className="w-auto p-0" align="start">
        <ChronoCalendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={disabled}
          fromDate={fromDate}
          toDate={toDate}
          defaultMonth={date}
          className="p-3"
        />
      </ChronoPopoverContent>
    </ChronoPopover>
  );
}
