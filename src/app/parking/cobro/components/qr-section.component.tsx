"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ValidateFeeForm,
  ValidateFeeSchema,
} from "@/src/shared/schemas/parking/validate-fee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChronoField, ChronoFieldError } from "@chrono/chrono-field.component";
import ChronoQrScannerInput from "@chrono/chrono-qr-scanner-input.component";
import ChronoPlateInput from "@chrono/chrono-plate-input.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import ChronoButton from "@chrono/chrono-button.component";
import { Settings2, X, Check } from "lucide-react";

import { usePaymentContext } from "@/src/shared/context/payment.context";
import { useCommonStore } from "@/src/shared/stores/common.store";
import { cn } from "@/src/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { getRateProfileAction } from "@/src/app/global-actions/get-common.action";
import { TRateProfile } from "@/shared/types/common/rate-profile.type";

import { IValidateAmountParamsEntity } from "@/server/domain";

type RatesByVehicleType = {
  [vehicleTypeId: string]: {
    rates: TRateProfile[];
    isLoading: boolean;
    selectedRateId: string | null;
  };
};

type ConfigMode = "scan" | "rate";

type QrSectionProps = {
  className?: string;
};

export function QrSectionComponent({ className }: QrSectionProps) {
  const { validateFee, clearValidateResult, validateRaw, isValidating } = usePaymentContext();
  const { vehicleTypes } = useCommonStore();
  
  const [configMode, setConfigMode] = useState<ConfigMode>("scan");
  const [ratesByVehicleType, setRatesByVehicleType] = useState<RatesByVehicleType>({});
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState<string | null>(null);

  // Load rates for all vehicle types when entering rate config
  useEffect(() => {
    if (configMode === "rate" && vehicleTypes.length > 0) {
      vehicleTypes.forEach((vt) => {
        // Only load if not already loaded
        if (!ratesByVehicleType[vt.value]) {
          setRatesByVehicleType((prev) => ({
            ...prev,
            [vt.value]: { rates: [], isLoading: true, selectedRateId: null },
          }));
          
          getRateProfileAction(vt.value).then((res) => {
            if (res.success && res.data?.data) {
              const rates = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
              setRatesByVehicleType((prev) => ({
                ...prev,
                [vt.value]: {
                  ...prev[vt.value],
                  rates: rates.filter((r) => r.isActive),
                  isLoading: false,
                },
              }));
            } else {
              setRatesByVehicleType((prev) => ({
                ...prev,
                [vt.value]: { ...prev[vt.value], rates: [], isLoading: false },
              }));
            }
          });
        }
      });
    }
  }, [configMode, vehicleTypes, ratesByVehicleType]);

  // Reset config when validation result arrives
  useEffect(() => {
    if (validateRaw?.data) {
      queueMicrotask(() => {
        setConfigMode("scan");
        setSelectedRateId(null);
        setSelectedVehicleTypeId(null);
        // Clear all selections but keep loaded rates
        setRatesByVehicleType((prev) => {
          const updated: RatesByVehicleType = {};
          Object.keys(prev).forEach((key) => {
            updated[key] = { ...prev[key], selectedRateId: null };
          });
          return updated;
        });
      });
    }
  }, [validateRaw]);

  const handleRateSelect = useCallback((vehicleTypeId: string, rateId: string) => {
    // Clear all other selections and set only this one
    setRatesByVehicleType((prev) => {
      const updated: RatesByVehicleType = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = {
          ...prev[key],
          selectedRateId: key === vehicleTypeId ? rateId : null,
        };
      });
      return updated;
    });
    setSelectedRateId(rateId);
    setSelectedVehicleTypeId(vehicleTypeId);
  }, []);

  const handleClearAllSelections = useCallback(() => {
    setRatesByVehicleType((prev) => {
      const updated: RatesByVehicleType = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = { ...prev[key], selectedRateId: null };
      });
      return updated;
    });
    setSelectedRateId(null);
    setSelectedVehicleTypeId(null);
  }, []);

  const onValidateFee = async (data: IValidateAmountParamsEntity) => {
    clearValidateResult();
    if (!data.parkingSessionId && !data.licensePlate) return false;
    
    // If there's a pre-selected rate, include it in the validation
    const payload: IValidateAmountParamsEntity = {
      ...data,
      rateId: selectedRateId ?? undefined,
    };
    
    const success = await validateFee(payload);
    return success;
  };

  // Get the selected rate name for display
  const selectedRateName = selectedRateId && selectedVehicleTypeId
    ? ratesByVehicleType[selectedVehicleTypeId]?.rates.find(r => r.id === selectedRateId)?.name
    : null;
  const selectedVehicleTypeName = selectedVehicleTypeId
    ? vehicleTypes.find(vt => vt.value === selectedVehicleTypeId)?.label
    : null;

  return (
    <ChronoCard className={cn("min-w-0 overflow-hidden pb-0", className)}>
      <ChronoCardContent className="flex h-full min-h-0 flex-col">
        <ChronoCardHeader className="px-0">
          <div className="flex items-center justify-between">
            <ChronoCardTitle className="text-lg font-semibold">
              Validar tarifa
            </ChronoCardTitle>
            {configMode === "scan" && !validateRaw?.data && (
              <ChronoButton
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setConfigMode("rate")}
                disabled={isValidating}
              >
                <Settings2 className="h-3 w-3 mr-1" />
                Configurar tarifa
              </ChronoButton>
            )}
          </div>
        </ChronoCardHeader>

        {/* Selected config summary in scan mode */}
        {configMode === "scan" && !validateRaw?.data && selectedRateId && (
          <div className="flex items-center gap-2 text-sm mb-2">
            <ChronoBadge variant="secondary" className="text-xs">
              {selectedVehicleTypeName}
            </ChronoBadge>
            <span className="text-muted-foreground">→</span>
            <ChronoBadge variant="default" className="text-xs">
              {selectedRateName}
            </ChronoBadge>
            <ChronoButton
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={handleClearAllSelections}
              title="Limpiar tarifa"
            >
              <X className="h-3 w-3" />
            </ChronoButton>
          </div>
        )}

        {/* Rate Configuration Panel */}
        {configMode === "rate" && (
          <div className="flex flex-col gap-2 p-2 rounded-md border border-primary/20 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Tarifa manual</span>
              {selectedRateId && (
                <ChronoButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-5 px-1.5 text-[10px]"
                  onClick={handleClearAllSelections}
                  title="Limpiar selección"
                >
                  <X className="h-3 w-3 mr-0.5" />
                  Limpiar
                </ChronoButton>
              )}
            </div>

            <div className="flex gap-1.5">
              {vehicleTypes.map((vt) => {
                const vtData = ratesByVehicleType[vt.value];
                const isLoading = vtData?.isLoading ?? true;
                const rates = vtData?.rates ?? [];
                const currentSelection = vtData?.selectedRateId ?? null;
                const hasSelection = currentSelection !== null;

                return (
                  <div key={vt.value} className="flex-1 min-w-0">
                    <ChronoSelect
                      value={currentSelection ?? ""}
                      onValueChange={(rateId) => handleRateSelect(vt.value, rateId)}
                      disabled={isValidating || isLoading}
                    >
                      <ChronoSelectTrigger className={cn(
                        "h-7 text-xs px-2 transition-all",
                        hasSelection
                          ? "ring-1 ring-primary border-primary bg-primary/10"
                          : "opacity-70"
                      )}>
                        <ChronoSelectValue
                          placeholder={isLoading ? "..." : vt.label}
                        />
                      </ChronoSelectTrigger>
                      <ChronoSelectContent>
                        <div className="px-2 py-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                          {vt.label}
                        </div>
                        {rates.length === 0 ? (
                          <div className="px-2 py-1.5 text-xs text-muted-foreground">
                            Sin tarifas
                          </div>
                        ) : (
                          rates.map((rate) => (
                            <ChronoSelectItem key={rate.id} value={rate.id} className="text-xs">
                              {rate.name}
                            </ChronoSelectItem>
                          ))
                        )}
                      </ChronoSelectContent>
                    </ChronoSelect>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-1">
              <ChronoButton
                type="button"
                variant="default"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setConfigMode("scan")}
              >
                <Check className="h-3 w-3 mr-1" />
                Aceptar
              </ChronoButton>
            </div>
          </div>
        )}

        <QrFormComponent
          configMode={configMode}
          onValidateFee={onValidateFee}
          onClear={clearValidateResult}
          validatedPlate={validateRaw?.data?.vehicle?.licensePlate}
          hasValidatedData={Boolean(validateRaw?.data)}
        />
      </ChronoCardContent>
    </ChronoCard>
  );
}

function QrFormComponent({
  configMode,
  onValidateFee,
  onClear,
  validatedPlate,
  hasValidatedData = false,
}: {
  configMode: ConfigMode;
  onValidateFee: (data: IValidateAmountParamsEntity) => Promise<boolean>;
  onClear: () => void;
  validatedPlate?: string;
  hasValidatedData?: boolean;
}) {
  const isUpdatingFromServerRef = useRef(false);
  const prevHasValidatedDataRef = useRef(hasValidatedData);

  const validateFeeForm = useForm<ValidateFeeForm>({
    resolver: zodResolver(ValidateFeeSchema),
    defaultValues: {
      parkingSessionId: "",
      licensePlate: "",
    },
  });

  // Resetear formulario cuando se limpia el resultado validado (ej: después de un pago exitoso)
  useEffect(() => {
    // Detectar cambio de true a false (datos validados fueron limpiados)
    if (prevHasValidatedDataRef.current && !hasValidatedData) {
      validateFeeForm.reset({
        parkingSessionId: "",
        licensePlate: "",
      });
    }
    prevHasValidatedDataRef.current = hasValidatedData;
  }, [hasValidatedData, validateFeeForm]);

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
    // Evitar revalidar si el cambio viene del servidor
    if (isUpdatingFromServerRef.current) return;
    if (configMode !== "scan") return;

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
      {/* QR / Plate inputs - shown only in scan mode */}
      {configMode === "scan" && (
        <div className="flex flex-col gap-3 rounded-xl pb-1">
          <ChronoSectionLabel size="sm">QR o placa</ChronoSectionLabel>

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
      )}
    </form>
  );
}
