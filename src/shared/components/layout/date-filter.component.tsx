"use client";

import { MotionProps, motion } from "framer-motion";
import { ArrowLeftToLine, ArrowRightToLine, X } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import ChronoButton from "@chrono/chrono-button.component";
import { ChronoCalendar } from "@chrono/chrono-calendar.component";
import {
  ChronoPopover,
  ChronoPopoverContent,
  ChronoPopoverTrigger,
} from "@chrono/chrono-popover.component";
import { useRouter } from "next/navigation";
import { useChronoSidebar } from "@chrono/chrono-sidebar.component";

export function DateRangeComponent() {

  const { isMobile } = useChronoSidebar();

  const {replace} = useRouter()

  const [currentDate, setCurrentdate] = useState<Date | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get("date");
    if (!dateParam) return null;
    const parsedDate = new Date(dateParam);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
  });
  const [currentMotion, setCurrentMotion] = useState<"left" | "right">("right");
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const operateDay = (offset: number) => {
    setCurrentdate((prevDate) => {
      const date = prevDate ? new Date(prevDate) : new Date();
      date.setDate(date.getDate() + offset);
      return date;
    });
    setCurrentMotion(offset > 0 ? "right" : "left");
    setIsPickerOpen(false);
  };

  const handleSelectDate = (date?: Date | null) => {
    if (!date) return;
    setCurrentdate((prevDate) => {
      if (prevDate) {
        setCurrentMotion(date > prevDate ? "right" : "left");
      } else {
        setCurrentMotion("right");
      }
      return date;
    });
    setIsPickerOpen(false);
  };

  const clearDate = () => {
    setCurrentdate(null);
    setCurrentMotion("right");
    setIsPickerOpen(false);
  };

  const updateUrlParams = useCallback((date: Date | null) => {
    const params = new URLSearchParams(window.location.search);
    if (date) {
      params.set("date", date.toISOString().split("T")[0]);
    } else {
      params.delete("date");
    }
    const newUrl =
      window.location.pathname + "?" + params.toString() + window.location.hash;
    replace(newUrl);
  }, [replace]);


  useEffect(() => {
      updateUrlParams(currentDate);
  }, [currentDate, updateUrlParams]);

  const motionFromRight: MotionProps = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -60 },
    transition: { duration: 0.25 },
  };

  const motionFromLeft: MotionProps = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 60 },
    transition: { duration: 0.25 },
  };

  const motionProps =
    currentMotion === "right" ? motionFromRight : motionFromLeft;

  return (
    <div className="flex items-center gap-2">
      <ChronoButton
        variant={"ghost"}
        onClick={() => {
          operateDay(-1);
        }}
      >
        <ArrowLeftToLine />
      </ChronoButton>
      <ChronoPopover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <ChronoPopoverTrigger asChild>
          <ChronoButton
            type="button"
            variant="outline"
            className={
              isMobile
                ? "w-[180px] h-9 relative overflow-hidden justify-center z-20"
                : "min-w-[300px] h-9 relative overflow-hidden justify-center z-20"
            }
          >
            <motion.div
              key={currentDate ? currentDate.toDateString() : "today"}
              {...motionProps}
              className="font-medium absolute"
            >
              {currentDate
                ? currentDate.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Seleccionar fecha"}
            </motion.div>
            <span className="sr-only">Seleccionar fecha</span>
          </ChronoButton>
        </ChronoPopoverTrigger>
        <ChronoPopoverContent className="w-auto p-0" align="center">
          <ChronoCalendar
            mode="single"
            selected={currentDate ?? undefined}
            defaultMonth={currentDate ?? new Date()}
            onSelect={(date) => handleSelectDate(date ?? null)}
            initialFocus
          />
        </ChronoPopoverContent>
      </ChronoPopover>

      <ChronoButton
        type="button"
        variant="ghost"
        className="h-9 w-9"
        onClick={clearDate}
        disabled={!currentDate}
      >
        <X className="h-4 w-4" />
      </ChronoButton>

      <ChronoButton
        variant={"ghost"}
        onClick={() => {
          operateDay(1);
        }}
      >
        <ArrowRightToLine />
      </ChronoButton>
    </div>
  );
}