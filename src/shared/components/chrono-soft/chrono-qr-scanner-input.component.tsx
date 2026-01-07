"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { QrCode, RefreshCcw } from "lucide-react";

import { cn } from "@/src/lib/utils";
import ChronoButton from "./chrono-button.component";
import { ChronoInput } from "./chrono-input.component";

type ChronoQrScannerInputProps = ComponentProps<typeof ChronoInput> & {
  minScanLength?: number;
  onClear?: () => void;
};

const ChronoQrScannerInput = forwardRef<HTMLInputElement, ChronoQrScannerInputProps>(
  function ChronoQrScannerInput({
    className,
    value,
    onChange,
    minScanLength = 4,
    onClear = () => {},
    ...props
  }, ref) {
    const [flash, setFlash] = useState(false);
    const [focused, setFocused] = useState(false);
    const timerRef = useRef<number | null>(null);
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
      return () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }
      };
    }, []);

    const triggerFlash = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      setFlash(true);
      timerRef.current = window.setTimeout(() => setFlash(false), 220);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);

      if (event.target.value.length >= minScanLength) {
        triggerFlash();
      }
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
          flash && "border-emerald-400",
          className,
        )}
      >
        <div className="flex h-10 w-12 items-center justify-center rounded-full text-primary">
          <QrCode className="h-6 w-6" />
        </div>

        <ChronoInput
          ref={assignRef}
          {...props}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "border-0 bg-transparent px-0 text-base font-medium shadow-none tracking-wide ring-0 focus-visible:ring-0 dark:bg-transparent",
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

export default ChronoQrScannerInput;
