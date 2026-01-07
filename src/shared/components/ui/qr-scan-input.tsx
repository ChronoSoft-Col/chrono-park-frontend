import { useState } from "react";
import type { ChangeEvent } from "react";
import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/src/shared/components/ui/field";
import { QrCode } from "lucide-react";
import { Input } from "./input";
import { cn } from "@/src/lib/utils";

type QrScanInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  label?: string;
};

export function QrScanInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ field, fieldState, label = "Leer QR" }: QrScanInputProps<TFieldValues, TName>) {
  const [flash, setFlash] = useState(false);

  const onScan = (value: string) => {
    field.onChange(value);
    if (value?.length > 3) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }
  };

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        <QrCode className="w-6 h-6 text-primary" />
        <Input
          {...field}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onScan(event.target.value)}
          placeholder="Escanea el QR de ingreso"
          className={cn(
            "",
            flash && "animate-pulse border-b-green-500"
          )}
        />
      </div>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}