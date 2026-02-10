"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import type {
  ISubscriptionEntity,
  ISubscriptionStatusLog,
  SubscriptionStatus,
} from "@/server/domain";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import { getSubscriptionByIdAction } from "../actions/get-subscription-detail.action";

interface SubscriptionDetailDialogContentProps {
  subscriptionId: string;
  fallback: ISubscriptionEntity;
}

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long" }).format(date);
};


const formatDateTime = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "-";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price);
};

const getStatusBadgeStyles = (status: SubscriptionStatus | string) => {
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

const getStatusLabel = (status: SubscriptionStatus | string) => {
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
  subscriptionId,
  fallback,
}: SubscriptionDetailDialogContentProps) {
  const [item, setItem] = React.useState<ISubscriptionEntity>(fallback);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    getSubscriptionByIdAction(subscriptionId).then((res) => {
      if (cancelled) return;
      if (res.success && res.data?.data) {
        setItem(res.data.data);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [subscriptionId]);

  const customerName = item.customer
    ? `${item.customer.firstName} ${item.customer.lastName}`.trim()
    : "-";

  const statusHistory = item.statusHistory ?? [];

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

      <ChronoSeparator />

      <dl className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="Documento" value={item.customer?.documentNumber || "-"} />
        <InfoRow label="Email" value={item.customer?.email || "-"} />
        <InfoRow label="Plan Mensual" value={item.monthlyPlan?.name || "-"} />
        <InfoRow label="Precio del Plan" value={formatPrice(item.monthlyPlan?.price)} />
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

      <ChronoSeparator />

      {/* Status History */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
            Historial de estado
          </ChronoSectionLabel>
          {loading && (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </div>

        {statusHistory.length > 0 ? (
          <div className="rounded-lg border border-border/60 divide-y divide-border/40">
            {statusHistory.map((log) => (
              <StatusLogRow key={log.id} log={log} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-4 text-center text-xs text-muted-foreground">
            {loading ? "Cargando historial..." : "Sin cambios de estado."}
          </div>
        )}
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

function StatusLogRow({ log }: { log: ISubscriptionStatusLog }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {log.previousStatus && (
          <>
            <ChronoBadge
              variant="outline"
              className={`text-[10px] ${getStatusBadgeStyles(log.previousStatus)}`}
            >
              {getStatusLabel(log.previousStatus)}
            </ChronoBadge>
            <span className="text-xs text-muted-foreground">→</span>
          </>
        )}
        <ChronoBadge
          variant="outline"
          className={`text-[10px] ${getStatusBadgeStyles(log.newStatus)}`}
        >
          {getStatusLabel(log.newStatus)}
        </ChronoBadge>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[11px] text-muted-foreground">
          {formatDateTime(log.changedAt)}
        </p>
        {log.reason && (
          <p className="text-[11px] text-muted-foreground italic">{log.reason}</p>
        )}
      </div>
    </div>
  );
}
