"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ValidateFeeForm,
  ValidateFeeSchema,
} from "@/src/shared/schemas/parking/validate-fee.schema";
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
import { ChronoSwitch } from "@chrono/chrono-switch.component";

import { usePaymentContext } from "@/src/shared/context/payment.context";
import { cn } from "@/src/lib/utils";
import { useDebouncedCallback } from "use-debounce";

import { IValidateAmountParamsEntity } from "@/server/domain";

type QrSectionProps = {
  className?: string;
};

export function QrSectionComponent({ className }: QrSectionProps) {
  const { validateFee, clearValidateResult, validateRaw } = usePaymentContext();

  const onValidateFee = async (data: IValidateAmountParamsEntity) => {
    clearValidateResult();
    if (!data.parkingSessionId && !data.licensePlate) return false;
    const success = await validateFee(data);
    return success;
  };

  return (
    <ChronoCard className={cn("min-w-0 overflow-hidden pb-0", className)}>
      <ChronoCardContent className="flex h-full min-h-0 flex-col">
        <ChronoCardHeader className="px-0">
          <ChronoCardTitle className="text-lg font-semibold">
            Validar tarifa
          </ChronoCardTitle>
          <ChronoCardDescription>
            Escanea el QR para validar la tarifa de parqueo
          </ChronoCardDescription>
        </ChronoCardHeader>
        <QrFormComponent
          onValidateFee={onValidateFee}
          onClear={clearValidateResult}
          validatedPlate={validateRaw?.data?.vehicle?.licensePlate}
        />
      </ChronoCardContent>
    </ChronoCard>
  );
}

function QrFormComponent({
  onValidateFee,
  onClear,
  validatedPlate,
}: {
  onValidateFee: (data: IValidateAmountParamsEntity) => Promise<boolean>;
  onClear: () => void;
  validatedPlate?: string;
}) {
  const isUpdatingFromServerRef = useRef(false);
  const isUpdatingTimeRef = useRef(false);
  const [manualExitTime, setManualExitTime] = useState(false);

  const validateFeeForm = useForm<ValidateFeeForm>({
    resolver: zodResolver(ValidateFeeSchema),
    defaultValues: {
      exitTime: new Date(),
      parkingSessionId: "",
      licensePlate: "",
    },
  });

  // Sincronizar hora de salida automáticamente cada segundo (si no es manual)
  useEffect(() => {
    if (manualExitTime) return;

    const interval = setInterval(() => {
      isUpdatingTimeRef.current = true;
      validateFeeForm.setValue("exitTime", new Date(), {
        shouldValidate: false,
      });
      setTimeout(() => {
        isUpdatingTimeRef.current = false;
      }, 50);
    }, 1000);

    return () => clearInterval(interval);
  }, [manualExitTime, validateFeeForm]);

  // Actualizar el campo de placa cuando el servidor devuelve la placa validada
  useEffect(() => {
    if (validatedPlate) {
      const currentPlate = validateFeeForm.getValues("licensePlate");
      if (currentPlate !== validatedPlate) {
        isUpdatingFromServerRef.current = true;
        validateFeeForm.setValue("licensePlate", validatedPlate, {
          shouldValidate: false,
        });
        // Reset del flag después de un pequeño delay para evitar el debounce
        setTimeout(() => {
          isUpdatingFromServerRef.current = false;
        }, 50);
      }
    }
  }, [validatedPlate, validateFeeForm]);

  const handleFormChange = useDebouncedCallback(async () => {
    // Evitar revalidar si el cambio viene del servidor o de la sincronización automática
    if (isUpdatingFromServerRef.current || isUpdatingTimeRef.current) return;

    const values = validateFeeForm.getValues();
    const hasQr = Boolean(values.parkingSessionId?.trim());
    const hasPlate = Boolean(values.licensePlate?.trim());

    // Solo validar si hay QR o placa
    if (!hasQr && !hasPlate) return;

    // Validar formato antes de enviar
    const result = await validateFeeForm.trigger();
    if (!result) return;

    const payload: IValidateAmountParamsEntity = {
      parkingSessionId: values.parkingSessionId?.trim()
        ? values.parkingSessionId.trim()
        : undefined,
      licensePlate: values.licensePlate?.trim()
        ? values.licensePlate.trim()
        : undefined,
      exitTime: values.exitTime,
    };

    await onValidateFee(payload);
    // NO resetear los campos después de validar
  }, 800);

  return (
    <form
      className="my-4 flex min-h-0 flex-col gap-4 overflow-y-auto"
      onChange={handleFormChange}
      autoComplete="off"
    >
      <div className="flex flex-col gap-3 rounded-xl">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <ChronoBadge
              variant="outline"
              className="border-primary/40 text-foreground"
            >
              Paso 1
            </ChronoBadge>
            <ChronoSectionLabel size="sm">Hora de salida</ChronoSectionLabel>
          </div>
          <ChronoSwitch
            size="sm"
            checked={manualExitTime}
            onCheckedChange={setManualExitTime}
            label="Manual"
            labelPosition="left"
          />
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
                disabled={!manualExitTime}
              />

              {fieldState.invalid && (
                <ChronoFieldError errors={[fieldState.error]} />
              )}
            </ChronoField>
          )}
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl pb-1">
        <div className="flex items-center gap-1.5">
          <ChronoBadge
            variant="outline"
            className="border-primary/40 text-foreground"
          >
            Paso 2
          </ChronoBadge>
          <ChronoSectionLabel size="sm">QR o placa</ChronoSectionLabel>
        </div>

        <div className="flex min-w-0 flex-col gap-3 lg:flex-row">
          <Controller
            control={validateFeeForm.control}
            name="parkingSessionId"
            render={({ field, fieldState }) => (
              <ChronoField
                data-invalid={fieldState.invalid}
                className="min-w-0 flex-1"
              >
                <ChronoQrScannerInput
                  {...field}
                  id="parkingSessionId"
                  value={field.value ?? ""}
                  onClear={onClear}
                  placeholder="Escanea el código"
                />

                {fieldState.invalid && (
                  <ChronoFieldError errors={[fieldState.error]} />
                )}
              </ChronoField>
            )}
          />

          <Controller
            control={validateFeeForm.control}
            name="licensePlate"
            render={({ field, fieldState }) => (
              <ChronoField
                data-invalid={fieldState.invalid}
                className="min-w-0 flex-1"
              >
                <ChronoPlateInput
                  {...field}
                  id="licensePlate"
                  value={(field.value as string) ?? ""}
                  onClear={onClear}
                  placeholder="Placa"
                />

                {fieldState.invalid && (
                  <ChronoFieldError errors={[fieldState.error]} />
                )}
              </ChronoField>
            )}
          />
        </div>
      </div>
    </form>
  );
}
