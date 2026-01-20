"use client";

import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import ChronoButton from "@chrono/chrono-button.component";

export type ChronoViewWithTableLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: {
    label: ReactNode;
    icon?: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
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
  action,
  table,
  paginator,
  className,
  headerClassName,
  tableWrapperClassName,
  paginatorWrapperClassName,
}: ChronoViewWithTableLayoutProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description || action) && (
        <header className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", headerClassName)}>
          <div className="space-y-1">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>

          {action && (
            <div className="flex justify-start sm:justify-end">
              <ChronoButton
                type="button"
                onClick={action.onClick}
                icon={action.icon}
                disabled={action.disabled}
                loading={action.loading}
              >
                {action.label}
              </ChronoButton>
            </div>
          )}
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
