"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { IInOutEntity } from "@/server/domain";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import {
  ChronoField,
  ChronoFieldError,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import ChronoButton from "@chrono/chrono-button.component";
import { getRateProfileAction } from "@/src/app/global-actions/get-common.action";
import { TRateProfile } from "@/src/shared/types/common/rate-profile.type";
import { editParkingSessionAction } from "../actions/edit-parking-session.action";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

const ChangeRateSchema = z.object({
  rateProfileId: z.string().min(1, "Debe seleccionar una tarifa"),
});

type ChangeRateForm = z.infer<typeof ChangeRateSchema>;

interface ChangeRateDialogContentProps {
  item: IInOutEntity;
  onClose: () => void;
  onSuccess?: () => void;
}

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export function ChangeRateDialogContent({
  item,
  onClose,
  onSuccess,
}: ChangeRateDialogContentProps) {
  const [rateProfiles, setRateProfiles] = React.useState<TRateProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = React.useState(true);

  const form = useForm<ChangeRateForm>({
    resolver: zodResolver(ChangeRateSchema),
    mode: "onChange",
    defaultValues: {
      rateProfileId: item.rateProfile.id,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  // Cargar perfiles de tarifa al montar el componente
  React.useEffect(() => {
    const vehicleTypeId = item.vehicle.vehicleType.id;
    if (vehicleTypeId) {
      setLoadingProfiles(true);
      getRateProfileAction(vehicleTypeId)
        .then((response) => {
          if (response.success && response.data?.data) {
            setRateProfiles(
              Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data]
            );
          }
        })
        .finally(() => setLoadingProfiles(false));
    }
  }, [item.vehicle.vehicleType.id]);

  const handleFormSubmit = handleSubmit(async (data) => {
    const toastId = toast.loading("Actualizando tarifa...");
    try {
      const result = await editParkingSessionAction(item.id, {
        rateProfileId: data.rateProfileId,
      });

      if (result.success) {
        toast.success("Tarifa actualizada correctamente", { id: toastId });
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.error || "Error al actualizar la tarifa", { id: toastId });
      }
    } catch (error) {
      console.error("Error updating rate:", error);
      toast.error("Error inesperado al actualizar la tarifa", { id: toastId });
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      {/* Info actual del vehículo */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ChronoSectionLabel size="base" className="tracking-[0.25em]">
            Placa
          </ChronoSectionLabel>
          <ChronoValue size="xl">{item.vehicle.licensePlate}</ChronoValue>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tipo de vehículo
          </p>
          <p className="text-base font-semibold text-foreground">
            {item.vehicle.vehicleType.name}
          </p>
        </div>
      </div>

      <ChronoSeparator />

      {/* Info de la sesión */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Ingreso
          </p>
          <p className="text-base font-semibold text-foreground">
            {formatDateTime(item.entryTime)}
          </p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Tarifa actual
          </p>
          <p className="text-base font-semibold text-foreground">
            {item.rateProfile.name}
          </p>
        </div>
      </div>

      <ChronoSeparator />

      {/* Select de nueva tarifa */}
      <Controller
        control={control}
        name="rateProfileId"
        render={({ field, fieldState }) => (
          <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
            <ChronoFieldLabel htmlFor="rateProfileId" className={fieldLabelClasses}>
              Nueva tarifa
            </ChronoFieldLabel>

            <ChronoSelect
              onValueChange={field.onChange}
              value={field.value ?? ""}
              disabled={loadingProfiles || rateProfiles.length === 0}
            >
              <ChronoSelectTrigger className="mt-1 text-left">
                <ChronoSelectValue
                  placeholder={
                    loadingProfiles
                      ? "Cargando tarifas..."
                      : rateProfiles.length === 0
                        ? "No hay tarifas disponibles"
                        : "Seleccionar tarifa"
                  }
                />
              </ChronoSelectTrigger>
              <ChronoSelectContent>
                {rateProfiles.map((profile) => (
                  <ChronoSelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </ChronoSelectItem>
                ))}
              </ChronoSelectContent>
            </ChronoSelect>

            {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
          </ChronoField>
        )}
      />

      {/* Botones de acción */}
      <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
        <ChronoButton
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </ChronoButton>
        <ChronoButton
          type="submit"
          variant="default"
          disabled={isSubmitting || !isValid || loadingProfiles}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </ChronoButton>
      </div>
    </form>
  );
}
