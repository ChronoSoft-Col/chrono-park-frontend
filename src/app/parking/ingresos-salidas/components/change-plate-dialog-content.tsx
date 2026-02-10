"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { IInOutEntity } from "@/server/domain";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import {
  ChronoField,
  ChronoFieldError,
} from "@chrono/chrono-field.component";
import ChronoButton from "@chrono/chrono-button.component";
import ChronoPlateInput from "@chrono/chrono-plate-input.component";
import { isValidColombianPlate, normalizePlate } from "@/src/lib/utils/plate.utils";
import { editParkingSessionAction } from "../actions/edit-parking-session.action";
import { toast } from "sonner";
import { Save, X } from "lucide-react";

const ChangePlateSchema = z.object({
  licensePlate: z
    .string()
    .transform(normalizePlate)
    .refine((v) => isValidColombianPlate(v), {
      message: "Placa inválida (formato: ABC123, ABC12D o ABC12)",
    }),
});

type ChangePlateForm = z.infer<typeof ChangePlateSchema>;

interface ChangePlateDialogContentProps {
  item: IInOutEntity;
  onClose: () => void;
  onSuccess?: () => void;
}

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function ChangePlateDialogContent({
  item,
  onClose,
  onSuccess,
}: ChangePlateDialogContentProps) {
  const form = useForm<ChangePlateForm>({
    resolver: zodResolver(ChangePlateSchema),
    mode: "onChange",
    defaultValues: {
      licensePlate: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const handleFormSubmit = handleSubmit(async (data) => {
    if (data.licensePlate === item.vehicle.licensePlate) {
      toast.warning("La placa ingresada es la misma que la actual");
      return;
    }

    const toastId = toast.loading("Actualizando placa...");
    try {
      const result = await editParkingSessionAction(item.id, {
        licensePlate: data.licensePlate,
      });

      if (result.success) {
        toast.success("Placa actualizada correctamente", { id: toastId });
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.error || "Error al actualizar la placa", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error updating plate:", error);
      toast.error("Error inesperado al actualizar la placa", { id: toastId });
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ChronoSectionLabel size="base" className="tracking-[0.25em]">
            Placa actual
          </ChronoSectionLabel>
          <ChronoValue size="xl">{item.vehicle.licensePlate}</ChronoValue>
        </div>
        <ChronoBadge variant="outline" className="text-xs font-semibold">
          {item.vehicle.vehicleType.name}
        </ChronoBadge>
      </div>

      <ChronoSeparator />

      <dl className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Ingreso" value={formatDateTime(item.entryTime)} />
        <InfoRow label="Tarifa" value={item.rateProfile.name} />
      </dl>

      <ChronoSeparator />

      <div className="space-y-3">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Nueva placa
        </ChronoSectionLabel>

        <Controller
          control={control}
          name="licensePlate"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid}>
              <ChronoPlateInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder="Ej: ABC123"
                autoFocus
              />
              {fieldState.invalid && (
                <ChronoFieldError errors={[fieldState.error]} />
              )}
            </ChronoField>
          )}
        />
      </div>

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
          disabled={isSubmitting || !isValid}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Guardando..." : "Guardar cambios"}
        </ChronoButton>
      </div>
    </form>
  );
}
