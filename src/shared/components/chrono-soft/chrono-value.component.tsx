"use client";

import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

const sizeVariants = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
} as const;

const weightVariants = {
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

interface ChronoValueProps {
  children: ReactNode;
  size?: keyof typeof sizeVariants;
  weight?: keyof typeof weightVariants;
  className?: string;
  muted?: boolean;
}

export function ChronoValue({
  children,
  size = "lg",
  weight = "semibold",
  className,
  muted = false,
}: ChronoValueProps) {
  return (
    <p
      className={cn(
        "tracking-tight",
        sizeVariants[size],
        weightVariants[weight],
        muted ? "text-muted-foreground" : "text-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}
