"use client";

import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

const sizeVariants = {
  xs: "text-[9px]",
  sm: "text-[10px]",
  md: "text-[11px]",
  base: "text-xs",
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
