"use client";

import { Controller, useForm } from "react-hook-form";
import { ValidateFeeForm, ValidateFeeSchema } from "@/src/shared/schemas/parking/validate-fee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChronoField, ChronoFieldError } from "@chrono/chrono-field.component";
import { ChronoDateTimePicker } from "@chrono/chrono-date-time-picker.component";
import ChronoQrScannerInput from "@chrono/chrono-qr-scanner-input.component";
import ChronoPlateInput from "@chrono/chrono-plate-input.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";

import { usePaymentContext } from "@/src/shared/context/payment.context";
import { cn } from "@/src/lib/utils";
import { useDebouncedCallback } from "use-debounce";

import { IValidateAmountParamsEntity } from "@/server/domain";

type QrSectionProps = {
  className?: string;
};

export function QrSectionComponent({ className }: QrSectionProps) {
  const { validateFee, clearValidateResult } = usePaymentContext();

  const onValidateFee = async (data: IValidateAmountParamsEntity) => {
    clearValidateResult();
    if (!data.parkingSessionId && !data.licensePlate) return false;
    const success = await validateFee(data);
    return success;
  };

  return (
    <ChronoCard className={cn("overflow-hidden pb-0", className)}>
      <ChronoCardContent className="flex h-full flex-col">
      <ChronoCardHeader className="px-0">
        <ChronoCardTitle className="text-lg font-semibold">Validar tarifa</ChronoCardTitle>
        <ChronoCardDescription>Escanea el QR para validar la tarifa de parqueo</ChronoCardDescription>
      </ChronoCardHeader>
        <QrFormComponent onValidateFee={onValidateFee} onClear={clearValidateResult} />
      </ChronoCardContent>
    </ChronoCard>
  );
}

function QrFormComponent({
  onValidateFee,
  onClear
}: {
  onValidateFee: (data: IValidateAmountParamsEntity) => Promise<boolean>;
  onClear: () => void;
}) {
  const validateFeeForm = useForm<ValidateFeeForm>({
    resolver: zodResolver(ValidateFeeSchema),
    defaultValues: {
      exitTime: new Date(),
      parkingSessionId: "",
      licensePlate: "",
    },
  });

  const handleFormChange = useDebouncedCallback(async () => {
    const values = validateFeeForm.getValues();
    const hasQr = Boolean(values.parkingSessionId?.trim());
    const hasPlate = Boolean(values.licensePlate?.trim());
    
    // Solo validar si hay QR o placa
    if (!hasQr && !hasPlate) return;
    
    // Validar formato antes de enviar
    const result = await validateFeeForm.trigger();
    if (!result) return;

    const payload: IValidateAmountParamsEntity = {
      parkingSessionId: values.parkingSessionId?.trim() ? values.parkingSessionId.trim() : undefined,
      licensePlate: values.licensePlate?.trim() ? values.licensePlate.trim() : undefined,
      exitTime: values.exitTime,
    };

    await onValidateFee(payload);
    // NO resetear los campos después de validar
  }, 800);

  return (
      <form
        className="flex flex-col gap-4 my-4 overflow-y-auto"
        onChange={handleFormChange}
      >
        <div className="flex flex-col gap-3 rounded-xl">
          <div className="flex items-center gap-1.5">
            <ChronoBadge variant="outline" className="border-primary/40 text-foreground">
              Paso 1
            </ChronoBadge>
            <ChronoSectionLabel size="sm">
              Hora de salida
            </ChronoSectionLabel>
          </div>
          <Controller
            control={validateFeeForm.control}
            name="exitTime"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid}>
                <ChronoDateTimePicker
                  {...field}
                  date={field.value as Date | undefined}
                  setDate={(value) => field.onChange(value)}
                />

                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-xl pb-1">
          <div className="flex items-center gap-1.5">
            <ChronoBadge variant="outline" className="border-primary/40 text-foreground">
              Paso 2
            </ChronoBadge>
            <ChronoSectionLabel size="sm">
              QR o placa
            </ChronoSectionLabel>
          </div>

          <div className="flex flex-col lg:flex-row gap-3">
            <Controller
              control={validateFeeForm.control}
              name="parkingSessionId"
              render={({ field, fieldState }) => (
                <ChronoField data-invalid={fieldState.invalid} className="flex-1">
                  <ChronoQrScannerInput
                    {...field}
                    id="parkingSessionId"
                    value={field.value ?? ""}
                    onClear={onClear}
                    placeholder="Escanea el código"
                  />

                  {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
                </ChronoField>
              )}
            />

            <Controller
              control={validateFeeForm.control}
              name="licensePlate"
              render={({ field, fieldState }) => (
                <ChronoField data-invalid={fieldState.invalid} className="flex-1">
                  <ChronoPlateInput
                    {...field}
                    id="licensePlate"
                    value={field.value as string ?? ""}
                    onClear={onClear}
                    placeholder="Placa"
                  />

                  {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
                </ChronoField>
              )}
            />
          </div>
        </div>
      </form>
  );
}
