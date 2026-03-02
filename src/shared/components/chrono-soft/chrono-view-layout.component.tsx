"use client";

import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import ChronoButton from "@chrono/chrono-button.component";

export type ChronoViewLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: {
    label: ReactNode;
    icon?: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  filters?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export function ChronoViewLayout({
  title,
  description,
  action,
  filters,
  children,
  className,
  headerClassName,
  contentClassName,
}: ChronoViewLayoutProps) {
  return (
    <section className={cn("space-y-6", className)}>
      {(title || description || action) && (
        <header className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", headerClassName)}>
          <div className="space-y-1">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {filters}

            {action && (
              <ChronoButton
                type="button"
                onClick={action.onClick}
                icon={action.icon}
                disabled={action.disabled}
                loading={action.loading}
                size={"lg"}
              >
                {action.label}
              </ChronoButton>
            )}
          </div>
        </header>
      )}

      <div
        className={cn(
          "rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur",
          contentClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
