import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/src/lib/utils";
import { XIcon } from "lucide-react";

type ChronoSelectContextValue = {
  value: string;
  onValueChange: (nextValue: string) => void;
};

const ChronoSelectContext = React.createContext<ChronoSelectContextValue | null>(null);

type ChronoSelectProps = React.ComponentProps<typeof Select>;

export function ChronoSelect({
  value,
  defaultValue,
  onValueChange,
  ...props
}: ChronoSelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string>(
    (defaultValue as string | undefined) ?? ""
  );

  const currentValue = (isControlled ? value : internalValue) as string | undefined;

  const handleValueChange = React.useCallback(
    (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  const contextValue = React.useMemo<ChronoSelectContextValue>(
    () => ({ value: currentValue ?? "", onValueChange: handleValueChange }),
    [currentValue, handleValueChange]
  );

  return (
    <ChronoSelectContext.Provider value={contextValue}>
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        {...props}
      />
    </ChronoSelectContext.Provider>
  );
}

export const ChronoSelectGroup = SelectGroup;
export const ChronoSelectValue = SelectValue;
export const ChronoSelectScrollDownButton = SelectScrollDownButton;
export const ChronoSelectScrollUpButton = SelectScrollUpButton;

type ChronoSelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectTrigger> & {
  clearable?: boolean;
  onClear?: () => void;
  selectedValue?: string | null;
  clearAriaLabel?: string;
};

export const ChronoSelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectTrigger>,
  ChronoSelectTriggerProps
>(function ChronoSelectTrigger(
  {
    className,
    clearable = true,
    onClear,
    selectedValue,
    clearAriaLabel = "Limpiar selección",
    children,
    ...props
  },
  ref
) {
  const ctx = React.useContext(ChronoSelectContext);

  const resolvedSelectedValue =
    selectedValue ?? (ctx?.value ? ctx.value : null);

  const canClear = Boolean(
    resolvedSelectedValue && (onClear || ctx?.onValueChange)
  );

  const showClear = Boolean(clearable && canClear && !props.disabled);

  const handleClear = React.useCallback(() => {
    if (onClear) {
      onClear();
      return;
    }
    ctx?.onValueChange("");
  }, [ctx, onClear]);

  return (
    <SelectTrigger
      ref={ref}
      className={cn("chrono-select__trigger border-primary/20 bg-background/90 backdrop-blur", className)}
      {...props}
    >
      {children}
      {showClear ? (
        <button
          type="button"
          aria-label={clearAriaLabel}
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/30 focus-visible:ring-2 rounded-sm -mr-0.5"
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleClear();
          }}
        >
          <XIcon className="size-3.5" />
        </button>
      ) : null}
    </SelectTrigger>
  );
});

ChronoSelectTrigger.displayName = "ChronoSelectTrigger";

export function ChronoSelectContent({ className, ...props }: React.ComponentProps<typeof SelectContent>) {
  return <SelectContent className={cn("chrono-select__content", className)} {...props} />;
}

export function ChronoSelectLabel({ className, ...props }: React.ComponentProps<typeof SelectLabel>) {
  return <SelectLabel className={cn("chrono-select__label text-[11px] uppercase tracking-[0.2em]", className)} {...props} />;
}

export function ChronoSelectItem({ className, ...props }: React.ComponentProps<typeof SelectItem>) {
  return <SelectItem className={cn("chrono-select__item", className)} {...props} />;
}

export function ChronoSelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectSeparator>) {
  return <SelectSeparator className={cn("chrono-select__separator", className)} {...props} />;
}
