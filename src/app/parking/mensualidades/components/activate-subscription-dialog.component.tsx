"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ISubscriptionEntity } from "@/server/domain";
import { UseDialogContext } from "@/shared/context/dialog.context";

import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoField,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import { ChronoInput } from "@chrono/chrono-input.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";

import { activateSubscriptionAction } from "../actions/activate-subscription.action";

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

type Props = {
  subscription: ISubscriptionEntity;
};

export function ActivateSubscriptionDialogContent({ subscription }: Props) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const customerName = subscription.customer
    ? `${subscription.customer.firstName} ${subscription.customer.lastName}`.trim()
    : "-";

  const currentStatus = subscription.status;

  const handleActivate = async () => {
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
          <ChronoFieldLabel htmlFor="activate-reason">Motivo (opcional)</ChronoFieldLabel>
          <ChronoInput
            id="activate-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={submitting}
            placeholder="Activación administrativa"
          />
        </ChronoField>

        <div className="flex flex-wrap justify-end gap-2">
          <ChronoButton
            type="button"
            variant="default"
            onClick={handleActivate}
            disabled={submitting}
            loading={submitting}
          >
            Activar suscripción
          </ChronoButton>

          <ChronoButton
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={submitting}
          >
            Cancelar
          </ChronoButton>
        </div>
      </div>
    </div>
  );
}
