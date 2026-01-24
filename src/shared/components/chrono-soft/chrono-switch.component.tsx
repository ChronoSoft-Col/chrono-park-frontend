"use client";

import * as React from "react";
import { Switch } from "@/src/shared/components/ui/switch";
import { cn } from "@/src/lib/utils";

type ChronoSwitchProps = React.ComponentProps<typeof Switch> & {
  label?: string;
  description?: string;
  labelPosition?: "left" | "right";
};

function ChronoSwitch({
  className,
  label,
  description,
  labelPosition = "right",
  id,
  ...props
}: ChronoSwitchProps) {
  const generatedId = React.useId();
  const switchId = id ?? generatedId;

  const switchElement = (
    <Switch id={switchId} className={cn(className)} {...props} />
  );

  if (!label && !description) {
    return switchElement;
  }

  const labelElement = (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label
          htmlFor={switchId}
          className="text-sm font-medium leading-none cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      )}
      {description && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      {labelPosition === "left" && labelElement}
      {switchElement}
      {labelPosition === "right" && labelElement}
    </div>
  );
}

export { ChronoSwitch };
