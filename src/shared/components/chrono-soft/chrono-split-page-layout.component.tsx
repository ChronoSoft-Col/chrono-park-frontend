"use client";

import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import { ChronoSeparator } from "./chrono-separator.component";

export type ChronoSplitPageLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  left: ReactNode;
  right: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  leftClassName?: string;
  rightClassName?: string;
  divider?: boolean;
};

export default function ChronoSplitPageLayout({
  title,
  description,
  left,
  right,
  className,
  headerClassName,
  contentClassName,
  leftClassName,
  rightClassName,
  divider = true,
}: ChronoSplitPageLayoutProps) {
  return (
    <section className={cn("flex min-h-0 w-full flex-1 flex-col gap-6", className)}>
      {(title || description) && (
        <header className={cn("space-y-1", headerClassName)}>
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </header>
      )}

      <div
        className={cn(
          "grid min-h-0 w-full gap-6",
          divider
            ? "lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
            : "lg:grid-cols-2",
          contentClassName,
        )}
      >
        <div className={cn("min-h-0 min-w-0", leftClassName)}>{left}</div>

        {divider && (
          <ChronoSeparator
            orientation="vertical"
            muted
            className="hidden h-full lg:block"
          />
        )}

        <div className={cn("min-h-0 min-w-0", rightClassName)}>{right}</div>
      </div>
    </section>
  );
}
