"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { Wallet2, RefreshCcw } from "lucide-react";

import { cn } from "@/src/lib/utils";
import ChronoButton from "./chrono-button.component";
import { ChronoInput } from "./chrono-input.component";

type ChronoCashInputProps = ComponentProps<typeof ChronoInput> & {
  onClear?: () => void;
};

const formatCurrency = (value: string) => {
  // Eliminar todo excepto números
  const numbers = value.replace(/\D/g, "");
  if (!numbers) return "";
  
  // Convertir a número y formatear
  const num = parseInt(numbers, 10);
  return new Intl.NumberFormat("es-CO").format(num);
};

const ChronoCashInput = forwardRef<HTMLInputElement, ChronoCashInputProps>(
  function ChronoCashInput({
    className,
    value,
    onChange,
    onClear = () => {},
    ...props
  }, ref) {
    const [focused, setFocused] = useState(false);
    const [displayValue, setDisplayValue] = useState("");
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

    // Sincronizar valor formateado cuando cambia el value externo
    useEffect(() => {
      if (typeof value === "string" || typeof value === "number") {
        const numericValue = value.toString().replace(/\D/g, "");
        const formatted = formatCurrency(numericValue);
        // Solo actualizar si cambió para evitar loops
        if (formatted !== displayValue) {
          setDisplayValue(formatted);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.target.value;
      const numericValue = input.replace(/\D/g, "");
      
      // Actualizar display
      setDisplayValue(formatCurrency(numericValue));
      
      // Emitir solo el valor numérico
      const syntheticEvent = {
        ...event,
        target: {
          ...event.target,
          value: numericValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange?.(syntheticEvent);
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

      setDisplayValue("");
      const syntheticEvent = {
        target: {
          ...target,
          value: "",
        },
        currentTarget: target,
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(syntheticEvent);
      target.focus();
      onClear();
    };

    return (
      <div
        className={cn(
          "flex items-center gap-4 rounded-xl border border-border px-4 transition-colors duration-200 bg-background/90",
          focused && "border-primary",
          className,
        )}
      >
        <div className="flex h-10 w-12 items-center justify-center rounded-full text-primary">
          <Wallet2 className="h-6 w-6" />
        </div>

        <div className="flex-1 flex items-baseline gap-1">
          <span className="text-base font-medium text-muted-foreground">$</span>
          <ChronoInput
            ref={assignRef}
            {...props}
            type="text"
            inputMode="numeric"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              "border-0 bg-transparent px-0 text-base font-medium shadow-none tracking-wide focus-visible:ring-0 dark:bg-transparent",
              props.readOnly && "text-muted-foreground",
            )}
          />
        </div>

        <div>
          <ChronoButton type="button" className="h-8 w-8" variant="ghost" onClick={clearAndFocus}>
            <RefreshCcw className="h-4 w-4" />
          </ChronoButton>
        </div>
      </div>
    );
  },
);

export default ChronoCashInput;
