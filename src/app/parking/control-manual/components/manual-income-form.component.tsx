"use client";

import { getRateProfileAction } from "@/app/global-actions/get-common.action";
import { ChronoDateTimePicker } from "@chrono/chrono-date-time-picker.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardFooter,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import {
  ChronoField,
  ChronoFieldError,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import ChronoPlateInput from "@chrono/chrono-plate-input.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import ChronoVehicleTypeSelect from "@chrono/chrono-vehicle-type-select.component";
import { useCommonContext } from "@/shared/context/common.context";
import {
  ManualIncomeForm,
  ManualIncomeSchema,
} from "@/shared/schemas/parking/manual-income.schema";
import { TRateProfile } from "@/shared/types/common/rate-profile.type";
import { TVehicleType } from "@/shared/types/common/vehicle-types.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateManualIncomeAction } from "../actions/generate-manual-income.action";
import { IGenerateManualIncomeParamsEntity } from "@/server/domain";
import { usePrint } from "@/shared/hooks/common/use-print.hook";
import { IGenerateManualIncomeResponse } from "@/server/domain/entities/parking/manual-income/response/generate-manual-income-response.entity";

export default function ManualIncomeFormComponent() {
  const { vehicleTypes } = useCommonContext();
  const { printIncomeReceipt } = usePrint();

  const onManualIncomeSubmit = async (
    params: ManualIncomeForm,
  ): Promise<boolean> => {
    const toastId = toast.loading("Generando ingreso manual...");
    try {
      const data: IGenerateManualIncomeParamsEntity = {
        ...params,
        entryTime: params.entryTime.toISOString(),
      };
      const response = await generateManualIncomeAction(data);
      if (!response.success) {
        toast.error("Error generando ingreso manual: " + response.error, { id: toastId });
        return false;
      }

      const incomeResponse = response.data as IGenerateManualIncomeResponse;
      if (incomeResponse.data) {
        toast.loading("Enviando impresión...", { id: toastId });
        const printResult = await printIncomeReceipt(incomeResponse.data);
        if (!printResult.success) {
          toast.warning("Ingreso generado, pero no se pudo imprimir el ticket", { id: toastId });
          return true;
        }
      }

      toast.success("Ingreso manual generado correctamente", { id: toastId });
      return true;
    } catch (error) {
      console.error("Error generating manual income:", error);
      toast.error("Error inesperado al generar ingreso", { id: toastId });
      return false;
    }
  };

  return (
    <IncomeForm vehicleTypes={vehicleTypes} onSubmit={onManualIncomeSubmit} />
  );
}

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

const IncomeForm = ({
  vehicleTypes,
  onSubmit,
}: {
  vehicleTypes: TVehicleType[];
  onSubmit: (params: ManualIncomeForm) => Promise<boolean>;
}) => {
  const [rateProfiles, setRateProfiles] = useState<TRateProfile[]>([]);

  const incomeForm = useForm<ManualIncomeForm>({
    resolver: zodResolver(ManualIncomeSchema) as Resolver<ManualIncomeForm>,
    mode: "onChange",
    defaultValues: {
      entryTime: new Date(),
      licensePlate: "",
      vehicleTypeId: "",
      rateProfileId: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    resetField,
    formState: { isSubmitting, isValid },
  } = incomeForm;

  const vehicleTypeChanged = async (vehicleTypeId: string) => {
    resetField("rateProfileId", { defaultValue: "" });
    setRateProfiles([]);
    if (!vehicleTypeId) return;

    const toastId = toast.loading("Cargando perfiles de tarifa...");
    try {
      const profiles = await getRateProfileAction(vehicleTypeId);
      if (profiles.success) {
        setRateProfiles(profiles.data?.data || []);
        toast.dismiss(toastId);
      } else {
        toast.error("Error cargando perfiles de tarifa: " + profiles.error, { id: toastId });
      }
    } catch (error) {
      console.error("Error loading rate profiles:", error);
      toast.error("Error inesperado al cargar perfiles", { id: toastId });
    }
  };

  const handleFormSubmit = handleSubmit((data: ManualIncomeForm) => {
    const isSuccess = onSubmit(data);
    isSuccess.then((result) => {
      if (result) {
        reset({
          entryTime: new Date(),
          licensePlate: "",
          vehicleTypeId: "",
          rateProfileId: "",
        });
        setRateProfiles([]);
      }
    });
  });

  return (
    <form onSubmit={handleFormSubmit} className="flex h-full w-full">
      <ChronoCard className="flex h-full w-full flex-col">
        <ChronoCardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <ChronoBadge
              variant="outline"
              className="text-[11px] font-medium text-muted-foreground"
            >
              Control manual
            </ChronoBadge>
            {rateProfiles.length > 0 && (
              <ChronoBadge className="bg-muted text-[11px] font-medium text-muted-foreground">
                {rateProfiles.length} perfiles
              </ChronoBadge>
            )}
          </div>
          <div>
            <ChronoCardTitle className="text-2xl font-semibold text-foreground">
              Registrar ingreso manual
            </ChronoCardTitle>
            <ChronoCardDescription className="text-sm text-muted-foreground">
              Registra entradas manuales manteniendo consistencia con el módulo
              de cobro.
            </ChronoCardDescription>
          </div>
        </ChronoCardHeader>

        <ChronoCardContent className="space-y-4">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="grid gap-3 lg:col-span-2 lg:grid-cols-2">
              <Controller
                control={control}
                name="licensePlate"
                render={({ field, fieldState }) => (
                  <ChronoField
                    data-invalid={fieldState.invalid}
                    className={`${fieldContainerClasses} min-w-0`}
                  >
                    <ChronoFieldLabel
                      htmlFor="licensePlate"
                      className={fieldLabelClasses}
                    >
                      Placa
                    </ChronoFieldLabel>
                    <ChronoPlateInput
                      {...field}
                      id="licensePlate"
                      placeholder="QJJ15G"
                      className="mt-1"
                    />
                    {fieldState.invalid && (
                      <ChronoFieldError errors={[fieldState.error]} />
                    )}
                  </ChronoField>
                )}
              />

              <Controller
                name="vehicleTypeId"
                control={control}
                render={({ field, fieldState }) => (
                  <ChronoField
                    data-invalid={fieldState.invalid}
                    className={`${fieldContainerClasses} min-w-0`}
                  >
                    <ChronoFieldLabel
                      htmlFor="vehicleTypeId"
                      className={fieldLabelClasses}
                    >
                      Tipo de vehículo
                    </ChronoFieldLabel>

                    <ChronoVehicleTypeSelect
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        vehicleTypeChanged(value);
                      }}
                      options={vehicleTypes ?? []}
                      className="mt-1"
                    />

                    {fieldState.invalid && (
                      <ChronoFieldError errors={[fieldState.error]} />
                    )}
                  </ChronoField>
                )}
              />
            </div>

            <Controller
              name="entryTime"
              control={control}
              render={({ field, fieldState }) => (
                <ChronoField
                  data-invalid={fieldState.invalid}
                  className={fieldContainerClasses}
                >
                  <ChronoFieldLabel
                    htmlFor="entryTime"
                    className={fieldLabelClasses}
                  >
                    Fecha y hora de ingreso
                  </ChronoFieldLabel>

                  <ChronoDateTimePicker
                    date={field.value as Date | undefined}
                    setDate={(value) => field.onChange(value)}
                  />

                  {fieldState.invalid && (
                    <ChronoFieldError errors={[fieldState.error]} />
                  )}
                </ChronoField>
              )}
            />

            <Controller
              name="rateProfileId"
              control={control}
              render={({ field, fieldState }) => (
                <ChronoField
                  data-invalid={fieldState.invalid}
                  className={fieldContainerClasses}
                >
                  <ChronoFieldLabel
                    htmlFor="rateProfileId"
                    className={fieldLabelClasses}
                  >
                    Perfil de tarifa
                  </ChronoFieldLabel>
                  <ChronoSelect
                    onValueChange={(value) => field.onChange(value)}
                    disabled={rateProfiles.length === 0}
                    value={field.value ?? ""}
                  >
                    <ChronoSelectTrigger className="mt-1 text-left">
                      <ChronoSelectValue placeholder="Seleccionar perfil de tarifa" />
                    </ChronoSelectTrigger>
                    <ChronoSelectContent>
                      {rateProfiles?.map((profile) => (
                        <ChronoSelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </ChronoSelectItem>
                      ))}
                    </ChronoSelectContent>
                  </ChronoSelect>
                  {fieldState.invalid && (
                    <ChronoFieldError errors={[fieldState.error]} />
                  )}
                </ChronoField>
              )}
            />
          </div>
        </ChronoCardContent>

        <ChronoCardFooter className="flex-col gap-3 bg-muted/5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            El registro quedará auditado en el historial de control manual.
          </p>
          <ChronoButton
            type="submit"
            size="lg"
            disabled={isSubmitting || !isValid}
            className="min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Procesando
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Generar ingreso manual
              </>
            )}
          </ChronoButton>
        </ChronoCardFooter>
      </ChronoCard>
    </form>
  );
};
