"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import ChronoButton from "./chrono-button.component";
import { cn } from "@/src/lib/utils";
import {
  ChronoPopover,
  ChronoPopoverContent,
  ChronoPopoverTrigger,
} from "./chrono-popover.component";
import { ChronoCalendar } from "./chrono-calendar.component";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export type ChronoDateTimePickerProps = {
  date?: Date;
  setDate: (date: Date) => void;
  disabled?: boolean;
};

type TimePart = "hour" | "minute" | "ampm";

function useMeasuredHeight(isActive: boolean) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!isActive) {
      setHeight(null);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      if (rect.height > 0) setHeight(Math.round(rect.height));
    };

    update();
    const raf = window.requestAnimationFrame(update);

    if (typeof ResizeObserver === "undefined") {
      return () => window.cancelAnimationFrame(raf);
    }

    const observer = new ResizeObserver(() => update());
    observer.observe(element);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [isActive]);

  return { ref, height };
}

function applyTimePart(current: Date, type: TimePart, value: string) {
  const nextDate = new Date(current);

  if (type === "hour") {
    const hour = parseInt(value, 10);
    const isPm = nextDate.getHours() >= 12;
    nextDate.setHours((hour % 12) + (isPm ? 12 : 0));
    return nextDate;
  }

  if (type === "minute") {
    nextDate.setMinutes(parseInt(value, 10));
    return nextDate;
  }

  const currentHours = nextDate.getHours();
  if (value === "PM" && currentHours < 12) nextDate.setHours(currentHours + 12);
  if (value === "AM" && currentHours >= 12)
    nextDate.setHours(currentHours - 12);
  return nextDate;
}

type TimeColumnProps = {
  maxHeight?: number | null;
  children: React.ReactNode;
};

function TimeColumn({ maxHeight, children }: TimeColumnProps) {
  return (
    <ScrollArea
      className="w-64 sm:w-auto"
      style={maxHeight ? { maxHeight } : undefined}
    >
      {children}
      <ScrollBar orientation="horizontal" className="sm:hidden" />
      <ScrollBar orientation="vertical" className="hidden sm:flex" />
    </ScrollArea>
  );
}

export function ChronoDateTimePicker({
  date,
  setDate,
  disabled,
}: ChronoDateTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const { ref: calendarRef, height: calendarHeight } =
    useMeasuredHeight(isOpen);

  const hours = React.useMemo(
    () => Array.from({ length: 12 }, (_, index) => index + 1),
    [],
  );
  const minutes = React.useMemo(
    () => Array.from({ length: 12 }, (_, index) => index * 5),
    [],
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate || disabled) return;
    setDate(selectedDate);
  };

  const handleTimeChange = (type: TimePart, value: string) => {
    if (!date || disabled) return;
    setDate(applyTimePart(date, type, value));
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
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>MM/DD/YYYY hh:mm aa</span>
          )}
        </ChronoButton>
      </ChronoPopoverTrigger>

      <ChronoPopoverContent className="w-auto p-0">
        <div className="flex flex-col sm:flex-row">
          <div ref={calendarRef} className="shrink-0">
            <ChronoCalendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="p-4 [--cell-size:--spacing(9)]"
            />
          </div>

          <div
            className="flex flex-col divide-y sm:flex-row sm:self-stretch sm:divide-y-0 sm:divide-x sm:overflow-hidden"
            style={calendarHeight ? { maxHeight: calendarHeight } : undefined}
          >
            <TimeColumn maxHeight={calendarHeight}>
              <div className="flex p-2 sm:flex-col">
                {[...hours].reverse().map((hour) => (
                  <ChronoButton
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("hour", String(hour))}
                  >
                    {hour}
                  </ChronoButton>
                ))}
              </div>
            </TimeColumn>

            <TimeColumn maxHeight={calendarHeight}>
              <div className="flex p-2 sm:flex-col">
                {minutes.map((minute) => (
                  <ChronoButton
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("minute", String(minute))}
                  >
                    {minute}
                  </ChronoButton>
                ))}
              </div>
            </TimeColumn>

            <TimeColumn maxHeight={calendarHeight}>
              <div className="flex p-2 sm:flex-col">
                {["AM", "PM"].map((ampm) => (
                  <ChronoButton
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </ChronoButton>
                ))}
              </div>
            </TimeColumn>
          </div>
        </div>
      </ChronoPopoverContent>
    </ChronoPopover>
  );
}
