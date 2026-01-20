import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/src/lib/utils";

export const ChronoSelect = Select;
export const ChronoSelectGroup = SelectGroup;
export const ChronoSelectValue = SelectValue;
export const ChronoSelectScrollDownButton = SelectScrollDownButton;
export const ChronoSelectScrollUpButton = SelectScrollUpButton;

export const ChronoSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(function ChronoSelectTrigger({ className, ...props }, ref) {
  return (
    <SelectTrigger
      ref={ref}
      className={cn("chrono-select__trigger border-primary/20 bg-background/90 backdrop-blur", className)}
      {...props}
    />
  );
});

ChronoSelectTrigger.displayName = "ChronoSelectTrigger";

export function ChronoSelectContent({ className, ...props }: React.ComponentProps<typeof SelectContent>) {
  return <SelectContent className={cn("chrono-select__content", className)} {...props} />;
}

export function ChronoSelectLabel({ className, ...props }: React.ComponentProps<typeof SelectLabel>) {
  return <SelectLabel className={cn("chrono-select__label text-[11px] uppercase tracking-[0.2em]", className)} {...props} />;
}

export function ChronoSelectItem({ className, ...props }: React.ComponentProps<typeof SelectItem>) {
  return <SelectItem className={cn("chrono-select__item", className)} {...props} />;
}

export function ChronoSelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectSeparator>) {
  return <SelectSeparator className={cn("chrono-select__separator", className)} {...props} />;
}
