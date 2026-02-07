"use client";

import * as React from "react";

import type { ISubscriptionEntity, ISubscriptionPayment, SubscriptionStatus } from "@/server/domain";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCustomerSubscriptionsAction, getPaymentHistoryAction } from "../actions/get-subscription-history.action";

interface SubscriptionHistoryDialogContentProps {
  customerId: string;
  customerName: string;
}

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
};

const getStatusBadgeStyles = (status: SubscriptionStatus | string) => {
  switch (status) {
    case "PENDIENTE":
    case "PENDING":
      return "border-yellow-500/40 bg-yellow-50 text-yellow-700";
    case "ACTIVA":
      return "border-emerald-500/40 bg-emerald-50 text-emerald-700";
    case "PERIODO_GRACIA":
      return "border-amber-500/40 bg-amber-50 text-amber-700";
    case "INACTIVA":
      return "border-red-500/40 bg-red-50 text-red-700";
    case "CANCELADA":
      return "border-gray-500/40 bg-gray-50 text-gray-700";
    case "PAID":
    case "PAGADO":
      return "border-emerald-500/40 bg-emerald-50 text-emerald-700";
    default:
      return "border-border/60 bg-muted/40 text-muted-foreground";
  }
};

const getStatusLabel = (status: SubscriptionStatus | string) => {
  switch (status) {
    case "PENDIENTE":
      return "Pendiente";
    case "ACTIVA":
      return "Activa";
    case "PERIODO_GRACIA":
      return "Período de Gracia";
    case "INACTIVA":
      return "Inactiva";
    case "CANCELADA":
      return "Cancelada";
    case "PAID":
    case "PAGADO":
      return "Pagado";
    case "PENDING":
      return "Pendiente";
    default:
      return status;
  }
};

type SubscriptionWithPayments = ISubscriptionEntity & {
  loadedPayments?: ISubscriptionPayment[];
};

export function SubscriptionHistoryDialogContent({
  customerId,
  customerName,
}: SubscriptionHistoryDialogContentProps) {
  const [loading, setLoading] = React.useState(true);
  const [subscriptions, setSubscriptions] = React.useState<SubscriptionWithPayments[]>([]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await getCustomerSubscriptionsAction(customerId);
        if (response.success && response.data?.data) {
          const subs = response.data.data;
          // Cargar historial de pagos para cada suscripción
          const subsWithPayments = await Promise.all(
            subs.map(async (sub) => {
              const paymentsResponse = await getPaymentHistoryAction(sub.id);
              return {
                ...sub,
                loadedPayments: paymentsResponse.success && paymentsResponse.data?.data
                  ? paymentsResponse.data.data
                  : [],
              };
            })
          );
          setSubscriptions(subsWithPayments);
        } else {
          toast.error(response.error || "Error al cargar el historial");
        }
      } catch {
        toast.error("Error inesperado al cargar el historial");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        No se encontraron suscripciones para este cliente.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <ChronoSectionLabel size="base" className="tracking-[0.25em]">
          Historial de Suscripciones
        </ChronoSectionLabel>
        <ChronoValue size="xl">{customerName}</ChronoValue>
      </div>

      <ChronoSeparator />

      {subscriptions.map((subscription) => (
        <div
          key={subscription.id}
          className="space-y-4 rounded-2xl border border-border/60 bg-card/80 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">
                {subscription.monthlyPlan?.name || "-"}
              </p>
              <p className="text-xs text-muted-foreground">
                {subscription.vehicle?.plateNumber || "Sin vehículo asignado"}
              </p>
            </div>

            <ChronoBadge
              variant="outline"
              className={getStatusBadgeStyles(subscription.status)}
            >
              {getStatusLabel(subscription.status)}
            </ChronoBadge>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-muted-foreground">Vigencia: </span>
              <span className="font-medium">
                {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Precio del plan: </span>
              <span className="font-medium">
                {formatCurrency(subscription.monthlyPlan?.price || 0)}
              </span>
            </div>
          </div>

          {subscription.loadedPayments && subscription.loadedPayments.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Historial de Pagos
              </p>
              <div className="space-y-2">
                {subscription.loadedPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {payment.monthsCount} {payment.monthsCount === 1 ? "mes" : "meses"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.periodStart)} - {formatDate(payment.periodEnd)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
