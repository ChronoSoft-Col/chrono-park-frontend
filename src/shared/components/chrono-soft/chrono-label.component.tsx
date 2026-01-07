import { ComponentProps } from "react";
import { Label } from "../ui/label";
import { cn } from "@/src/lib/utils";

export type ChronoLabelProps = ComponentProps<typeof Label> & {
  required?: boolean;
};

export function ChronoLabel({ className, required, children, ...props }: ChronoLabelProps) {
  return (
    <Label
      className={cn(
        "chrono-label uppercase tracking-[0.2em] text-[11px] text-muted-foreground",
        required && "after:ml-1 after:text-destructive after:content-['*']",
        className
      )}
      {...props}
    >
      {children}
    </Label>
  );
}
