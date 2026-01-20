"use client";

import * as React from "react";
import { CarFront, CircleQuestionMark, Motorbike, RefreshCcw, Truck } from "lucide-react";

import { cn } from "@/src/lib/utils";
import ChronoButton from "./chrono-button.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "./chrono-select.component";

export type ChronoVehicleTypeOption = {
  value: string;
  label: string;
};

export type ChronoVehicleTypeSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  onClear?: () => void;
  options: ChronoVehicleTypeOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  triggerClassName?: string;
};

function normalizeText(value: string) {
  return value
    .trim()
    .toLowerCase()
    // Remove common accents/diacritics.
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function getIconForVehicleTypeLabel(label?: string) {
  const normalized = normalizeText(label ?? "");

  if (/(moto|motocicleta|motocycle|motorcycle)/.test(normalized)) {
    return Motorbike;
  }

  if (/(camion|camioneta|truck|furgon|van)/.test(normalized)) {
    return Truck;
  }

  if(/(carro|coche|auto|automovil|car)/.test(normalized)) {
    return CarFront;
  }

  return CircleQuestionMark;
}

export default function ChronoVehicleTypeSelect({
  value,
  onValueChange,
  onClear = () => {},
  options,
  placeholder = "Seleccionar tipo",
  disabled,
  className,
  containerClassName,
  triggerClassName,
}: ChronoVehicleTypeSelectProps) {
  const [focused, setFocused] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const selected = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const iconNode = React.useMemo(() => {
    const Icon = getIconForVehicleTypeLabel(selected?.label);
    return <Icon className="h-6 w-6" />;
  }, [selected?.label]);

  const clear = React.useCallback(() => {
    onValueChange?.("");
    onClear();
  }, [onClear, onValueChange]);

  const activate = React.useCallback(() => {
    if (disabled) return;
    triggerRef.current?.focus();
    setOpen(true);
  }, [disabled]);

  return (
    <div
      className={cn(
        "flex w-full min-w-0 items-center gap-4 rounded-xl border border-border px-4 transition-colors duration-200 bg-background/90",
        (focused || open) && "border-primary",
        disabled && "opacity-70",
        className,
        containerClassName,
      )}
      onClick={(event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest("[data-chrono-vehicle-type-clear]")) return;
        activate();
      }}
    >
      <div className="flex h-10 w-12 items-center justify-center rounded-full text-primary">
        {iconNode}
      </div>

      <div className="flex-1 min-w-0">
        <ChronoSelect
          value={value ?? ""}
          onValueChange={(nextValue) => onValueChange?.(nextValue)}
          disabled={disabled}
          open={open}
          onOpenChange={setOpen}
        >
          <ChronoSelectTrigger
            className={cn(
              "w-full! min-w-0!",
              "h-10 border-0",
              "px-0",
              "text-xl font-medium focus:ring-0 focus-visible:ring-0",
              "data-placeholder:text-sm data-placeholder:font-normal",
              "bg-transparent dark:bg-transparent dark:hover:bg-transparent backdrop-blur-0",
              triggerClassName,
            )}
            ref={triggerRef}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          >
            <ChronoSelectValue placeholder={placeholder} className="line-clamp-1" />
          </ChronoSelectTrigger>

          <ChronoSelectContent>
            {options.map((option) => (
              <ChronoSelectItem key={option.value} value={option.value}>
                {option.label}
              </ChronoSelectItem>
            ))}
          </ChronoSelectContent>
        </ChronoSelect>
      </div>

      <div>
        <ChronoButton
          type="button"
          data-chrono-vehicle-type-clear
          className="h-8 w-8"
          variant="ghost"
          onClick={(event) => {
            event.stopPropagation();
            clear();
          }}
          disabled={disabled || !value}
        >
          <RefreshCcw className="h-4 w-4" />
        </ChronoButton>
      </div>
    </div>
  );
}
