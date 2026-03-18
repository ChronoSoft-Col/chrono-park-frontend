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

import { editSubscriptionEndDateAction } from "../actions/edit-subscription-end-date.action";
import { activateSubscriptionAction } from "../actions/activate-subscription.action";

type Props = {
  subscription: ISubscriptionEntity;
};

function toInputDate(value: Date | string | undefined | null): string {
  if (!value) return "";
  if (typeof value === "string") {
    // Backend often sends YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }
    return "";
  }
  return value.toISOString().slice(0, 10);
}

function isValidDateInput(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(d.getTime());
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
  const canActivate = can(MensualidadesAction.ACTIVAR_MENSUALIDAD);

  const [endDate, setEndDate] = React.useState(() => toInputDate(subscription.endDate));
  const [reason, setReason] = React.useState<string>("");
  const [submitting, setSubmitting] = React.useState(false);

  const [fieldError, setFieldError] = React.useState<string | null>(null);

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

    if (!isValidDateInput(endDate)) {
      setFieldError("Formato inválido. Use YYYY-MM-DD");
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Actualizando fecha de fin...");
    try {
      const result = await editSubscriptionEndDateAction(subscription.id, {
        endDate,
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

  const handleActivate = async () => {
    if (!canActivate) return;

    setSubmitting(true);
    const toastId = toast.loading("Activando suscripción...");
    try {
      const result = await activateSubscriptionAction(subscription.id, {
        reason: reason.trim() || undefined,
      });

      if (!result.success || !result.data?.success) {
        toast.error(
          result.error || result.data?.message || "Error al activar la suscripción",
          { id: toastId },
        );
        return;
      }

      toast.success("Suscripción activada", { id: toastId });
      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Error activating subscription:", error);
      toast.error("Error inesperado al activar la suscripción", { id: toastId });
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
          <ChronoFieldLabel htmlFor="endDate">Fecha de fin</ChronoFieldLabel>
          <ChronoInput
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
          {canActivate ? (
            <ChronoButton
              type="button"
              variant="secondary"
              onClick={handleActivate}
              disabled={submitting || currentStatus === "ACTIVA"}
            >
              Activar
            </ChronoButton>
          ) : null}

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

        {!canEditEndDate && !canActivate ? (
          <p className="text-xs text-muted-foreground">
            No cuentas con permisos para editar esta mensualidad.
          </p>
        ) : null}
      </div>
    </div>
  );
}
