"use client";

import type { ISubscriptionEntity, SubscriptionStatus } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import { ChronoBadge } from "@chrono/chrono-badge.component";
import { CheckCircle2, CreditCard, Eye, History, Pencil, XCircle } from "lucide-react";
import { MensualidadesAction } from "@/src/shared/enums/auth/permissions.enum";
import { ChronoRowActions } from "@/src/shared/components/chrono-soft/chrono-row-actions.component";

type ViewDetailHandler = (item: ISubscriptionEntity) => void;
type ViewHistoryHandler = (item: ISubscriptionEntity) => void;
type PayHandler = (item: ISubscriptionEntity) => void;
type CancelHandler = (item: ISubscriptionEntity) => void;
type ActivateHandler = (item: ISubscriptionEntity) => void;
type EditHandler = (item: ISubscriptionEntity) => void;
type IsCancellingHandler = (item: ISubscriptionEntity) => boolean;
type IsActivatingHandler = (item: ISubscriptionEntity) => boolean;


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
  onActivate?: ActivateHandler,
  onEdit?: EditHandler,
  isCancelling?: IsCancellingHandler,
  isActivating?: IsActivatingHandler,
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
      const canActivate =
        Boolean(onActivate) &&
        !expired &&
        row.status !== "ACTIVA" &&
        row.status !== "CANCELADA";
      const canEdit = Boolean(onEdit);
      const cancelLoading = isCancelling?.(row) ?? false;
      const activateLoading = isActivating?.(row) ?? false;

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

      const activateDisabledReason = !onActivate
        ? "Acción no disponible"
        : expired
          ? "Mensualidad vencida"
          : row.status === "ACTIVA"
            ? "Mensualidad ya activa"
            : row.status === "CANCELADA"
              ? "Mensualidad cancelada"
              : undefined;

      return (
        <ChronoRowActions
          actions={[
            {
              key: "edit",
              label: "Editar",
              icon: <Pencil className="h-4 w-4" />,
              onClick: () => onEdit?.(row),
              disabled: !canEdit,
              variant: "outline",
              action: MensualidadesAction.EDITAR_FECHA_MENSUALIDAD,
            },
            {
              key: "pay",
              label: "Pagar",
              icon: <CreditCard className="h-4 w-4" />,
              onClick: () => onPay?.(row),
              disabled: !canPay,
              disabledReason: payDisabledReason,
              variant: "default",
              action: MensualidadesAction.PAGAR_MENSUALIDAD,
            },
            {
              key: "activate",
              label: "Activar",
              icon: <CheckCircle2 className="h-4 w-4" />,
              onClick: () => onActivate?.(row),
              disabled: !canActivate,
              disabledReason: activateDisabledReason,
              loading: activateLoading,
              variant: "secondary",
              action: MensualidadesAction.ACTIVAR_MENSUALIDAD,
            },
            {
              key: "cancel",
              label: "Cancelar",
              icon: <XCircle className="h-4 w-4" />,
              onClick: () => onCancel?.(row),
              disabled: !canCancel || cancelLoading,
              disabledReason: cancelDisabledReason,
              loading: cancelLoading,
              variant: "destructive",
              action: MensualidadesAction.CANCELAR_MENSUALIDAD,
            },
            {
              key: "detail",
              label: "Ver detalle",
              icon: <Eye className="h-4 w-4" />,
              onClick: () => onViewDetail?.(row),
              variant: "secondary",
            },
            {
              key: "history",
              label: "Ver historial",
              icon: <History className="h-4 w-4" />,
              onClick: () => onViewHistory?.(row),
              variant: "outline",
            },
          ]}
          overflowAfter={4}
          className="flex justify-end gap-2"
        />
      );
    },
  },
];
