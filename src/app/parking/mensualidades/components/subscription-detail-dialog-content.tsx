"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { ISubscriptionEntity, SubscriptionStatus } from "@/server/domain";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import ChronoButton from "@chrono/chrono-button.component";
import { CreditCard, XCircle } from "lucide-react";
import { UseDialogContext } from "@/shared/context/dialog.context";
import { PaySubscriptionDialogContent } from "./pay-subscription-dialog.component";
import { cancelSubscriptionAction } from "../actions/cancel-subscription.action";
import { toast } from "sonner";

interface SubscriptionDetailDialogContentProps {
  item: ISubscriptionEntity;
}

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(date);
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "-";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};

const getStatusBadgeStyles = (status: SubscriptionStatus) => {
  switch (status) {
    case "PENDIENTE":
      return "border-yellow-500/40 bg-yellow-50 text-yellow-700";
    case "ACTIVA":
      return "border-emerald-500/40 bg-emerald-50 text-emerald-700";
    case "PERIODO_GRACIA":
      return "border-amber-500/40 bg-amber-50 text-amber-700";
    case "INACTIVA":
      return "border-red-500/40 bg-red-50 text-red-700";
    case "CANCELADA":
      return "border-gray-500/40 bg-gray-50 text-gray-700";
    default:
      return "border-border/60 bg-muted/40 text-muted-foreground";
  }
};

const getStatusLabel = (status: SubscriptionStatus) => {
  switch (status) {
    case "PENDIENTE":
      return "Pendiente de Pago";
    case "ACTIVA":
      return "Activa";
    case "PERIODO_GRACIA":
      return "Período de Gracia";
    case "INACTIVA":
      return "Inactiva";
    case "CANCELADA":
      return "Cancelada";
    default:
      return status;
  }
};

export function SubscriptionDetailDialogContent({
  item,
}: SubscriptionDetailDialogContentProps) {
  const router = useRouter();
  const { openDialog, closeDialog } = UseDialogContext();
  const [cancelling, setCancelling] = React.useState(false);

  const customerName = item.customer
    ? `${item.customer.firstName} ${item.customer.lastName}`.trim()
    : "-";

  const headerRows = [
    {
      label: "Documento",
      value: item.customer?.documentNumber || "-",
    },
    {
      label: "Email",
      value: item.customer?.email || "-",
    },
    {
      label: "Plan Mensual",
      value: item.monthlyPlan?.name || "-",
    },
    {
      label: "Precio del Plan",
      value: formatPrice(item.monthlyPlan?.price),
    },
  ];

  const handlePayClick = () => {
    openDialog({
      title: "Pagar Suscripción",
      description: "Complete el pago para activar la suscripción",
      content: <PaySubscriptionDialogContent subscription={item} />,
    });
  };

  const handleCancelClick = async () => {
    if (!confirm("¿Está seguro de cancelar esta suscripción?")) return;

    setCancelling(true);
    const toastId = toast.loading("Cancelando suscripción...");
    try {
      const result = await cancelSubscriptionAction(item.id, { reason: "Cancelado por el usuario" });
      if (result.success && result.data?.success) {
        toast.success("Suscripción cancelada", { id: toastId });
        closeDialog();
        router.refresh();
      } else {
        toast.error(result.error || "Error al cancelar la suscripción", { id: toastId });
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Error al cancelar la suscripción", { id: toastId });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ChronoSectionLabel size="base" className="tracking-[0.25em]">
            Suscripción Mensual
          </ChronoSectionLabel>
          <ChronoValue size="xl">{customerName}</ChronoValue>
        </div>

        <ChronoBadge variant="outline" className={getStatusBadgeStyles(item.status)}>
          {getStatusLabel(item.status)}
        </ChronoBadge>
      </div>

      {/* Action buttons for PENDIENTE status */}
      {item.status === "PENDIENTE" && (
        <div className="flex gap-2">
          <ChronoButton
            onClick={handlePayClick}
            icon={<CreditCard className="h-4 w-4" />}
            iconPosition="left"
          >
            Pagar Ahora
          </ChronoButton>
          <ChronoButton
            variant="destructive"
            onClick={handleCancelClick}
            loading={cancelling}
            icon={<XCircle className="h-4 w-4" />}
            iconPosition="left"
          >
            Cancelar
          </ChronoButton>
        </div>
      )}

      {/* Cancel button for active subscriptions */}
      {(item.status === "ACTIVA" || item.status === "PERIODO_GRACIA") && (
        <ChronoButton
          variant="outline"
          onClick={handleCancelClick}
          loading={cancelling}
          icon={<XCircle className="h-4 w-4" />}
          iconPosition="left"
        >
          Cancelar Suscripción
        </ChronoButton>
      )}

      <ChronoSeparator />

      <dl className="grid gap-4 sm:grid-cols-2">
        {headerRows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>

      <div className="space-y-3">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Vehículo
        </ChronoSectionLabel>

        {item.vehicle ? (
          <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Placa
            </p>
            <p className="text-base font-semibold text-foreground">
              {item.vehicle.plateNumber || "-"}
            </p>
            {item.vehicle.vehicleTypeName && (
              <p className="mt-1 text-xs text-muted-foreground">
                {item.vehicle.vehicleTypeName}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-4 text-center text-xs text-muted-foreground">
            Sin vehículo asociado.
          </div>
        )}
      </div>

      <div className="space-y-3">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Vigencia
        </ChronoSectionLabel>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow label="Fecha de inicio" value={formatDate(item.startDate)} />
          <InfoRow label="Fecha de vencimiento" value={formatDate(item.endDate)} />
        </div>
      </div>
    </div>
  );
}

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
