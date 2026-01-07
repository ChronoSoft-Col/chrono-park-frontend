"use client";

import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

const sizeVariants = {
  xs: "text-[8px]",
  sm: "text-[9px]",
  md: "text-[10px]",
  base: "text-[11px]",
} as const;

interface ChronoSectionLabelProps {
  children: ReactNode;
  size?: keyof typeof sizeVariants;
  className?: string;
}

export function ChronoSectionLabel({
  children,
  size = "xs",
  className,
}: ChronoSectionLabelProps) {
  return (
    <p
      className={cn(
        "font-semibold uppercase tracking-[0.3em] text-muted-foreground",
        sizeVariants[size],
        className
      )}
    >
      {children}
    </p>
  );
}
