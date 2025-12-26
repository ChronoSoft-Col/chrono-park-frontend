"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { CarFront, RefreshCcw } from "lucide-react";

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
          "flex items-center gap-4 rounded-xl border border-border/40 px-4 shadow-md transition-colors duration-200 bg-background",
          focused && "border-primary",
          className,
        )}
      >
        <div className="flex h-10 w-12 items-center justify-center rounded-full text-primary">
          <CarFront className="h-6 w-6" />
        </div>

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
            "border-0 px-0 text-2xl font-medium shadow-none tracking-[0.3em] uppercase focus-visible:ring-0",
            "placeholder:normal-case placeholder:tracking-normal placeholder:text-base placeholder:font-normal",
            props.readOnly && "text-muted-foreground",
          )}
        />

        <div>
          <ChronoButton type="button" className="h-8 w-8" variant="ghost" onClick={clearAndFocus}>
            <RefreshCcw className="h-4 w-4" />
          </ChronoButton>
        </div>
      </div>
    );
  },
);

export default ChronoPlateInput;
