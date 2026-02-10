"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { IdCard, RefreshCcw } from "lucide-react";

import { cn } from "@/src/lib/utils";
import ChronoButton from "./chrono-button.component";
import { ChronoInput } from "./chrono-input.component";

type ChronoPlateInputProps = ComponentProps<typeof ChronoInput> & {
  onClear?: () => void;
};

const normalizePlate = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

const ChronoPlateInput = forwardRef<HTMLInputElement, ChronoPlateInputProps>(
  function ChronoPlateInput({
    className,
    value,
    onChange,
    onClear = () => {},
    ...props
  }, ref) {
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const assignRef = useCallback(
      (instance: HTMLInputElement | null) => {
        inputRef.current = instance;

        if (typeof ref === "function") {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      },
      [ref],
    );

    useEffect(() => {
      // Keep controlled value normalized (when value is a string)
      if (!inputRef.current) return;
      if (typeof value !== "string") return;

      const normalized = normalizePlate(value);
      if (normalized !== value) {
        inputRef.current.value = normalized;
      }
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const target = event.target;
      const normalized = normalizePlate(target.value);

      if (normalized !== target.value) {
        target.value = normalized;
      }

      onChange?.(event);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      props.onBlur?.(event);
    };

    const clearAndFocus = () => {
      const target = inputRef.current;
      if (!target) return;

      target.value = "";
      const syntheticEvent = {
        target,
        currentTarget: target,
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
      target.focus();
      onClear();
    };

    return (
      <div
        className={cn(
          "flex h-7 items-center gap-2 rounded-md border border-border px-2 transition-colors duration-200 bg-background/90",
          focused && "border-primary", 
          className,
        )}
      >
        <div className="flex size-6 items-center justify-center text-primary">
          <IdCard className="size-4" />
        </div>

        <div className="flex-1 min-w-0">
          <ChronoInput
            ref={assignRef}
            {...props}
            inputMode="text"
            autoCapitalize="characters"
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "border-0 bg-transparent px-0 text-sm font-medium shadow-none tracking-[0.3em] uppercase focus-visible:ring-0 dark:bg-transparent",
              "placeholder:normal-case placeholder:tracking-normal placeholder:text-sm placeholder:font-normal",
              props.readOnly && "text-muted-foreground",
            )}
          />
        </div>

        <div className="ml-auto shrink-0">
          <ChronoButton type="button" size="icon-sm" variant="ghost" onClick={clearAndFocus}>
            <RefreshCcw className="size-3" />
          </ChronoButton>
        </div>
      </div>
    );
  },
);

export default ChronoPlateInput;
