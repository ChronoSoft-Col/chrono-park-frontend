"use client";

import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";

export type ChronoViewWithTableLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  table: ReactNode;
  paginator?: ReactNode;
  className?: string;
  headerClassName?: string;
  tableWrapperClassName?: string;
  paginatorWrapperClassName?: string;
};

export function ChronoViewWithTableLayout({
  title,
  description,
  table,
  paginator,
  className,
  headerClassName,
  tableWrapperClassName,
  paginatorWrapperClassName,
}: ChronoViewWithTableLayoutProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description) && (
        <header className={cn("space-y-1", headerClassName)}>
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </header>
      )}

      <div
        className={cn(
          "rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur",
          tableWrapperClassName,
        )}
      >
        {table}
      </div>

      {paginator && (
        <div
          className={cn(
            "rounded-2xl border border-dashed border-border/60 bg-muted/40 p-4",
            paginatorWrapperClassName,
          )}
        >
          {paginator}
        </div>
      )}
    </section>
  );
}
