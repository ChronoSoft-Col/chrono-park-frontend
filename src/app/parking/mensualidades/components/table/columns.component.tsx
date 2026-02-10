"use client";

import type { ISubscriptionEntity, SubscriptionStatus } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import ChronoButton from "@chrono/chrono-button.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/shared/components/ui/tooltip";
import { CreditCard, Eye, History, XCircle } from "lucide-react";

type ViewDetailHandler = (item: ISubscriptionEntity) => void;
type ViewHistoryHandler = (item: ISubscriptionEntity) => void;
type PayHandler = (item: ISubscriptionEntity) => void;
type CancelHandler = (item: ISubscriptionEntity) => void;
type IsCancellingHandler = (item: ISubscriptionEntity) => boolean;

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

const isExpiredSubscription = (row: ISubscriptionEntity) => {
  if (!row.endDate) return false;
  const end = row.endDate instanceof Date ? row.endDate : new Date(row.endDate);
  if (Number.isNaN(end.getTime())) return false;
  const endOfDay = new Date(end);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() < Date.now();
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
      return "Pendiente";
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

export const createSubscriptionColumns = (
  onViewDetail?: ViewDetailHandler,
  onViewHistory?: ViewHistoryHandler,
  onPay?: PayHandler,
  onCancel?: CancelHandler,
  isCancelling?: IsCancellingHandler
): ChronoDataTableColumn<ISubscriptionEntity>[] => [
  {
    id: "customer",
    header: "Cliente",
    accessorFn: (row) => {
      if (!row.customer) return "-";
      return `${row.customer.firstName} ${row.customer.lastName}`.trim() || "-";
    },
  },
  {
    id: "document",
    header: "Documento",
    accessorFn: (row) => row.customer?.documentNumber || "-",
  },
  {
    id: "vehicle",
    header: "Vehículo",
    cell: (row) => (
      <div>
        <p className="font-medium">{row.vehicle?.plateNumber || "-"}</p>
        <p className="text-xs text-muted-foreground">{row.vehicle?.vehicleTypeName || "-"}</p>
      </div>
    ),
  },
  {
    id: "monthly-plan",
    header: "Plan",
    accessorFn: (row) => row.monthlyPlan?.name || "-",
  },
  {
    id: "start-date",
    header: "Inicio",
    accessorFn: (row) => formatDate(row.startDate),
  },
  {
    id: "end-date",
    header: "Vencimiento",
    accessorFn: (row) => formatDate(row.endDate),
  },
  {
    id: "status",
    header: "Estado",
    align: "center",
    headerClassName: "text-center",
    cellClassName: "text-center",
    cell: (row) => (
      <ChronoBadge variant="outline" className={getStatusBadgeStyles(row.status)}>
        {getStatusLabel(row.status)}
      </ChronoBadge>
    ),
  },
  {
    id: "actions",
    header: "Acciones",
    align: "right",
    headerClassName: "text-right",
    cellClassName: "text-right",
    cell: (row) => {
      const expired = isExpiredSubscription(row);
      const canPay = Boolean(onPay) && row.status === "PENDIENTE" && !expired;
      const canCancel =
        Boolean(onCancel) &&
        (row.status === "PENDIENTE" ||
          row.status === "ACTIVA" ||
          row.status === "PERIODO_GRACIA") &&
        !expired;
      const cancelLoading = isCancelling?.(row) ?? false;

      const payDisabledReason = !onPay
        ? "Acción no disponible"
        : expired
        ? "Mensualidad vencida"
        : row.status !== "PENDIENTE"
          ? "Solo disponible cuando está Pendiente"
          : undefined;

      const cancelDisabledReason = !onCancel
        ? "Acción no disponible"
        : expired
        ? "Mensualidad vencida"
        : row.status === "CANCELADA"
          ? "Mensualidad cancelada"
          : row.status === "INACTIVA"
            ? "Mensualidad inactiva"
            : undefined;

      return (
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="default"
                aria-label="Pagar mensualidad"
                disabled={!canPay}
                onClick={() => onPay?.(row)}
              >
                <CreditCard className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">
              {canPay ? "Pagar" : `No disponible: ${payDisabledReason ?? "Estado no permitido"}`}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="destructive"
                aria-label="Cancelar mensualidad"
                disabled={!canCancel || cancelLoading}
                loading={cancelLoading}
                onClick={() => onCancel?.(row)}
              >
                <XCircle className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">
              {canCancel ? "Cancelar" : `No disponible: ${cancelDisabledReason ?? "Estado no permitido"}`}
            </TooltipContent>
          </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ChronoButton
              type="button"
              variant="secondary"
              aria-label="Ver detalle"
              onClick={() => onViewDetail?.(row)}
            >
              <Eye className="h-4 w-4" />
            </ChronoButton>
          </TooltipTrigger>
          <TooltipContent side="top">Ver detalle</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <ChronoButton
              type="button"
              variant="outline"
              aria-label="Ver historial"
              onClick={() => onViewHistory?.(row)}
            >
              <History className="h-4 w-4" />
            </ChronoButton>
          </TooltipTrigger>
          <TooltipContent side="top">Ver historial de pagos</TooltipContent>
        </Tooltip>
      </div>
      );
    },
  },
];
