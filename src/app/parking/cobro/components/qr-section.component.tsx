"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import ChronoButton from "@chrono/chrono-button.component";
import { Settings2, X } from "lucide-react";

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

type QrSectionProps = {
  className?: string;
};

export function QrSectionComponent({ className }: QrSectionProps) {
  const { validateFee, clearValidateResult, validateRaw, isValidating } = usePaymentContext();
  const { vehicleTypes } = useCommonStore();
  
  // Pre-scan rate configuration state - one entry per vehicle type
  const [showRateConfig, setShowRateConfig] = useState(false);
  const [ratesByVehicleType, setRatesByVehicleType] = useState<RatesByVehicleType>({});
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState<string | null>(null);

  // Load rates for all vehicle types when opening the config panel
  useEffect(() => {
    if (showRateConfig && vehicleTypes.length > 0) {
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
  }, [showRateConfig, vehicleTypes, ratesByVehicleType]);

  // Reset rate config when validation result changes (after successful scan)
  useEffect(() => {
    if (validateRaw?.data) {
      queueMicrotask(() => {
        setShowRateConfig(false);
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

  const handleToggleRateConfig = useCallback(() => {
    if (showRateConfig) {
      setShowRateConfig(false);
    } else {
      setShowRateConfig(true);
    }
  }, [showRateConfig]);

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
          <ChronoCardTitle className="text-lg font-semibold">
            Validar tarifa
          </ChronoCardTitle>
          <ChronoCardDescription>
            Escanea el QR para validar la tarifa de parqueo
          </ChronoCardDescription>
        </ChronoCardHeader>
        
        {/* Rate Configuration Section */}
        <div className="mb-3">
          {!validateRaw?.data && (
            <>
              {!showRateConfig ? (
                <div className="flex items-center justify-between">
                  {selectedRateId ? (
                    <div className="flex items-center gap-2 text-sm">
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
                        className="h-6 w-6"
                        onClick={handleClearAllSelections}
                        title="Limpiar selección"
                      >
                        <X className="h-3.5 w-3.5" />
                      </ChronoButton>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Tarifa automática según placa
                    </span>
                  )}
                  <ChronoButton
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleToggleRateConfig}
                    disabled={isValidating}
                  >
                    <Settings2 className="h-3 w-3 mr-1" />
                    Configurar tarifa
                  </ChronoButton>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-2 rounded-md border border-primary/20 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Tarifa manual</span>
                    <div className="flex items-center gap-0.5">
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
                      <ChronoButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={handleToggleRateConfig}
                        disabled={isValidating}
                        title="Cerrar"
                      >
                        <X className="h-3 w-3" />
                      </ChronoButton>
                    </div>
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
                </div>
              )}
            </>
          )}
        </div>
        
        <QrFormComponent
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
  onValidateFee,
  onClear,
  validatedPlate,
  hasValidatedData = false,
}: {
  onValidateFee: (data: IValidateAmountParamsEntity) => Promise<boolean>;
  onClear: () => void;
  validatedPlate?: string;
  hasValidatedData?: boolean;
}) {
  const isUpdatingFromServerRef = useRef(false);
  const isUpdatingTimeRef = useRef(false);
  const prevHasValidatedDataRef = useRef(hasValidatedData);
  const [manualExitTime, setManualExitTime] = useState(false);

  const validateFeeForm = useForm<ValidateFeeForm>({
    resolver: zodResolver(ValidateFeeSchema),
    defaultValues: {
      exitTime: new Date(),
      parkingSessionId: "",
      licensePlate: "",
    },
  });

  // Resetear formulario cuando se limpia el resultado validado (ej: después de un pago exitoso)
  useEffect(() => {
    // Detectar cambio de true a false (datos validados fueron limpiados)
    if (prevHasValidatedDataRef.current && !hasValidatedData) {
      validateFeeForm.reset({
        exitTime: new Date(),
        parkingSessionId: "",
        licensePlate: "",
      });
      // Diferir el setState para evitar renders en cascada
      queueMicrotask(() => setManualExitTime(false));
    }
    prevHasValidatedDataRef.current = hasValidatedData;
  }, [hasValidatedData, validateFeeForm]);

  // Sincronizar hora de salida automáticamente cada segundo (si no es manual y no hay datos validados)
  useEffect(() => {
    if (manualExitTime || hasValidatedData) return;

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
  }, [manualExitTime, hasValidatedData, validateFeeForm]);

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
            disabled={hasValidatedData}
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
                disabled={hasValidatedData || !manualExitTime}
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
