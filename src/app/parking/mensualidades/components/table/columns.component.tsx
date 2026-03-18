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
import { CreditCard, Eye, History, Pencil, XCircle } from "lucide-react";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { MensualidadesAction } from "@/src/shared/enums/auth/permissions.enum";

type ViewDetailHandler = (item: ISubscriptionEntity) => void;
type ViewHistoryHandler = (item: ISubscriptionEntity) => void;
type PayHandler = (item: ISubscriptionEntity) => void;
type CancelHandler = (item: ISubscriptionEntity) => void;
type EditHandler = (item: ISubscriptionEntity) => void;
type IsCancellingHandler = (item: ISubscriptionEntity) => boolean;


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
  onEdit?: EditHandler,
  isCancelling?: IsCancellingHandler,
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
        <p className="text-xs text-muted-foreground">
          {row.vehicle?.vehicleTypeName || "-"}
        </p>
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
    accessorFn: (row) => <>{row.startDate}</>,
  },
  {
    id: "end-date",
    header: "Vencimiento",
    accessorFn: (row) => <>{row.endDate}</>,
  },
  {
    id: "status",
    header: "Estado",
    align: "center",
    headerClassName: "text-center",
    cellClassName: "text-center",
    cell: (row) => (
      <ChronoBadge
        variant="outline"
        className={getStatusBadgeStyles(row.status)}
      >
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
      const canPay = Boolean(onPay) && row.status !== "CANCELADA";
      const canCancel =
        Boolean(onCancel) &&
        (row.status !== "CANCELADA");
      const canEdit = Boolean(onEdit);
      const cancelLoading = isCancelling?.(row) ?? false;

      const payDisabledReason = !onPay
        ? "Acción no disponible"
        : expired
          ? "Mensualidad vencida"
          : row.status === "CANCELADA"
            ? "Mensualidad cancelada"
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
          <PermissionGuard
            actions={[
              MensualidadesAction.EDITAR_FECHA_MENSUALIDAD,
              MensualidadesAction.ACTIVAR_MENSUALIDAD,
            ]}
            mode="some"
            hidden
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ChronoButton
                  type="button"
                  variant="outline"
                  aria-label="Editar mensualidad"
                  disabled={!canEdit}
                  onClick={() => onEdit?.(row)}
                >
                  <Pencil className="h-4 w-4" />
                </ChronoButton>
              </TooltipTrigger>
              <TooltipContent side="top">Editar</TooltipContent>
            </Tooltip>
          </PermissionGuard>

          <PermissionGuard action={MensualidadesAction.PAGAR_MENSUALIDAD} hidden>
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
                {canPay
                  ? "Pagar"
                  : `No disponible: ${payDisabledReason ?? "Estado no permitido"}`}
              </TooltipContent>
            </Tooltip>
          </PermissionGuard>

          <PermissionGuard action={MensualidadesAction.CANCELAR_MENSUALIDAD} hidden>
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
                {canCancel
                  ? "Cancelar"
                  : `No disponible: ${cancelDisabledReason ?? "Estado no permitido"}`}
              </TooltipContent>
            </Tooltip>
          </PermissionGuard>

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
