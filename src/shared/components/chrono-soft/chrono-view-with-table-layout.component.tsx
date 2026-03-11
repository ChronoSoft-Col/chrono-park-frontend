"use client";

import type { ReactNode } from "react";

import { cn } from "@/src/lib/utils";
import ChronoButton from "@chrono/chrono-button.component";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import type { AppAction } from "@/src/shared/enums/auth/permissions.enum";
import { PermissionButtonFallback } from "../chrono/permission-button-fallback.component";

export type ChronoViewWithTableLayoutProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: {
    label: ReactNode;
    icon?: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    /** Si se especifica, el botón solo se muestra si el usuario tiene esta acción */
    permission?: AppAction | string;
  };
  filters?: ReactNode;
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
  filters,
  table,
  paginator,
  className,
  headerClassName,
  tableWrapperClassName,
  paginatorWrapperClassName,
}: ChronoViewWithTableLayoutProps) {
  return (
    <section className={cn("space-y-6", "h-full", "overflow-y-auto", className)}>
      {(title || description || action) && (
        <header className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", headerClassName)}>
          <div className="space-y-1">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            {filters}

            {action && (() => {
              const btn = (
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
              );

              return action.permission ? (
                <PermissionGuard action={action.permission} fallback={<PermissionButtonFallback label={("Sin permiso para " + action.label).toLocaleUpperCase()} />}>
                  {btn}
                </PermissionGuard>
              ) : btn;
            })()}
          </div>
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
