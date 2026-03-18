"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ISubscriptionEntity } from "@/server/domain";
import { MensualidadesAction } from "@/src/shared/enums/auth/permissions.enum";
import { usePermissionsContext } from "@/src/shared/context/permissions.context";
import { UseDialogContext } from "@/shared/context/dialog.context";

import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoField,
  ChronoFieldLabel,
  ChronoFieldError,
} from "@chrono/chrono-field.component";
import { ChronoInput } from "@chrono/chrono-input.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoDatePicker } from "@chrono/chrono-date-picker.component";

import { editSubscriptionEndDateAction } from "../actions/edit-subscription-end-date.action";

type Props = {
  subscription: ISubscriptionEntity;
};

function toDateObj(value: Date | string | undefined | null): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function formatISODate(date: Date | undefined): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const statusStyles: Record<string, string> = {
  PENDIENTE: "border-yellow-500/40 bg-yellow-50 text-yellow-700",
  ACTIVA: "border-emerald-500/40 bg-emerald-50 text-emerald-700",
  PERIODO_GRACIA: "border-amber-500/40 bg-amber-50 text-amber-700",
  INACTIVA: "border-red-500/40 bg-red-500/10 text-red-700",
  CANCELADA: "border-gray-500/40 bg-gray-50 text-gray-700",
};

const statusLabel: Record<string, string> = {
  PENDIENTE: "Pendiente de pago",
  ACTIVA: "Activa",
  PERIODO_GRACIA: "Período de gracia",
  INACTIVA: "Inactiva",
  CANCELADA: "Cancelada",
};

export function EditSubscriptionDialogContent({ subscription }: Props) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();
  const { can } = usePermissionsContext();

  const canEditEndDate = can(MensualidadesAction.EDITAR_FECHA_MENSUALIDAD);

  const [endDate, setEndDate] = React.useState<Date | undefined>(() => toDateObj(subscription.endDate));
  const [reason, setReason] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);

  const [fieldError, setFieldError] = React.useState<string | null>(null);

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const customerName = subscription.customer
    ? `${subscription.customer.firstName} ${subscription.customer.lastName}`.trim()
    : "-";

  const currentStatus = subscription.status;

  const handleSaveEndDate = async () => {
    if (!canEditEndDate) return;

    setFieldError(null);

    if (!endDate) {
      setFieldError("La fecha de fin es requerida");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Actualizando fecha de fin...");
    try {
      const result = await editSubscriptionEndDateAction(subscription.id, {
        endDate: formatISODate(endDate),
        reason: reason.trim() || undefined,
      });

      if (!result.success || !result.data?.success) {
        toast.error(
          result.error || result.data?.message || "Error al actualizar la fecha",
          { id: toastId },
        );
        return;
      }

      toast.success("Fecha de fin actualizada", { id: toastId });
      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Error editing subscription end date:", error);
      toast.error("Error inesperado al actualizar la fecha", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Suscripción
          </p>
          <p className="text-base font-semibold text-foreground truncate">
            {customerName}
          </p>
        </div>

        <ChronoBadge
          variant="outline"
          className={statusStyles[String(currentStatus)] ?? "border-border/60 bg-muted/40 text-muted-foreground"}
        >
          {statusLabel[String(currentStatus)] ?? String(currentStatus)}
        </ChronoBadge>
      </div>

      <div className="rounded-lg border border-border/60 bg-card/70 p-4 space-y-4">
        <ChronoField>
          <ChronoFieldLabel>Fecha de fin</ChronoFieldLabel>
          <ChronoDatePicker
            date={endDate}
            onDateChange={setEndDate}
            placeholder="Seleccionar fecha de fin"
            dateFormat="dd 'de' MMMM, yyyy"
            fromDate={today}
            disabled={!canEditEndDate || submitting}
          />
          {fieldError ? <ChronoFieldError>{fieldError}</ChronoFieldError> : null}
        </ChronoField>

        <ChronoField>
          <ChronoFieldLabel htmlFor="reason">Motivo (opcional)</ChronoFieldLabel>
          <ChronoInput
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={submitting}
            placeholder="Ajuste administrativo"
          />
        </ChronoField>

        <div className="flex flex-wrap justify-end gap-2">
          {canEditEndDate ? (
            <ChronoButton
              type="button"
              variant="default"
              onClick={handleSaveEndDate}
              disabled={submitting}
              loading={submitting}
            >
              Guardar cambios
            </ChronoButton>
          ) : null}

          <ChronoButton
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={submitting}
          >
            Cerrar
          </ChronoButton>
        </div>

        {!canEditEndDate ? (
          <p className="text-xs text-muted-foreground">
            No cuentas con permisos para editar esta mensualidad.
          </p>
        ) : null}
      </div>
    </div>
  );
}
