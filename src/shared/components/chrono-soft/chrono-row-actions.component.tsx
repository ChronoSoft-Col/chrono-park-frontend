"use client";

import * as React from "react";

import type { AppAction } from "@/src/shared/enums/auth/permissions.enum";
import { usePermissionsContext } from "@/src/shared/context/permissions.context";
import ChronoButton from "@chrono/chrono-button.component";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/shared/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/components/ui/popover";
import { MoreVertical } from "lucide-react";

export type ChronoRowAction = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
  loading?: boolean;
  /** shadcn button variants via ChronoButton */
  variant?: React.ComponentProps<typeof ChronoButton>["variant"];
  /** Permission requirements */
  action?: AppAction | string;
  actions?: (AppAction | string)[];
  mode?: "every" | "some";
};

export type ChronoRowActionsProps = {
  actions: ChronoRowAction[];
  /** If visible actions exceed this, collapse into a popover menu (default: 4). */
  overflowAfter?: number;
  className?: string;
};

function isAllowed(
  can: (a: AppAction | string) => boolean,
  canAll: (list: (AppAction | string)[]) => boolean,
  canAny: (list: (AppAction | string)[]) => boolean,
  a: ChronoRowAction,
): boolean {
  if (a.action) return can(a.action);
  if (a.actions && a.actions.length > 0) {
    const mode = a.mode ?? "every";
    return mode === "every" ? canAll(a.actions) : canAny(a.actions);
  }
  return true;
}

export function ChronoRowActions({
  actions,
  overflowAfter = 4,
  className,
}: ChronoRowActionsProps) {
  const { can, canAll, canAny } = usePermissionsContext();

  const visibleActions = React.useMemo(
    () => actions.filter((a) => isAllowed(can, canAll, canAny, a)),
    [actions, can, canAll, canAny],
  );

  const [open, setOpen] = React.useState(false);

  if (visibleActions.length === 0) return null;

  const renderInline = visibleActions.length <= overflowAfter;

  if (renderInline) {
    return (
      <div className={className ?? "flex justify-end gap-2"}>
        {visibleActions.map((a) => {
          const tooltipText = a.disabled
            ? `No disponible: ${a.disabledReason ?? "Acción no permitida"}`
            : a.label;

          return (
            <Tooltip key={a.key}>
              <TooltipTrigger asChild>
                <ChronoButton
                  type="button"
                  size="icon"
                  variant={a.variant ?? "outline"}
                  aria-label={a.label}
                  disabled={a.disabled}
                  loading={a.loading}
                  onClick={a.onClick}
                >
                  {a.icon}
                </ChronoButton>
              </TooltipTrigger>
              <TooltipContent side="top">{tooltipText}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  return (
    <div className={className ?? "flex justify-end"}>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <ChronoButton
                type="button"
                size="icon"
                variant="outline"
                aria-label="Acciones"
              >
                <MoreVertical className="h-4 w-4" />
              </ChronoButton>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Acciones</TooltipContent>
        </Tooltip>

        <PopoverContent align="end" className="w-56 gap-1">
          {visibleActions.map((a) => {
            const disabled = Boolean(a.disabled || a.loading);

            return (
              <ChronoButton
                key={a.key}
                type="button"
                variant="ghost"
                className="w-full justify-start"
                disabled={disabled}
                loading={a.loading}
                onClick={() => {
                  if (disabled) return;
                  a.onClick();
                  setOpen(false);
                }}
                icon={a.icon}
              >
                {a.label}
              </ChronoButton>
            );
          })}
        </PopoverContent>
      </Popover>
    </div>
  );
}
