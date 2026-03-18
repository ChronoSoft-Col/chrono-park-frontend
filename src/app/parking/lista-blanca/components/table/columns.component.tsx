"use client";

import type { IWhiteListEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import { ChronoBadge } from "@chrono/chrono-badge.component";
import { Eye, Ban, Pencil } from "lucide-react";
import { ListaBlancaAction } from "@/src/shared/enums/auth/permissions.enum";
import { ChronoRowActions } from "@/src/shared/components/chrono-soft/chrono-row-actions.component";

type ViewDetailHandler = (item: IWhiteListEntity) => void;
type EditHandler = (item: IWhiteListEntity) => void;
type DeactivateHandler = (item: IWhiteListEntity) => void;

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

export const createWhiteListColumns = (
  onViewDetail?: ViewDetailHandler,
  onEdit?: EditHandler,
  onDeactivate?: DeactivateHandler,
): ChronoDataTableColumn<IWhiteListEntity>[] => [
  {
    id: "vehicle",
    header: "Vehículo",
    accessorFn: (row) => row.vehicle?.licensePlate || "-",
  },
  {
    id: "customer",
    header: "Cliente",
    accessorFn: (row) => row.customer?.fullName || "-",
  },
  {
    id: "reason",
    header: "Razón",
    accessorFn: (row) => row.reason,
  },
  {
    id: "start-date",
    header: "Inicio",
    accessorFn: (row) => formatDate(row.startDate),
  },
  {
    id: "end-date",
    header: "Fin",
    accessorFn: (row) => row.endDate ? formatDate(row.endDate) : "Indefinida",
  },
  {
    id: "status",
    header: "Estado",
    align: "center",
    headerClassName: "text-center",
    cellClassName: "text-center",
    cell: (row) => (
      <ChronoBadge
        variant={row.isActive ? "default" : "destructive"}
        tone="soft"
      >
        {row.isActive ? "Activo" : "Inactivo"}
      </ChronoBadge>
    ),
  },
  {
    id: "created-at",
    header: "Creado",
    accessorFn: (row) => formatDate(row.createdAt),
  },
  {
    id: "actions",
    header: "Acciones",
    align: "right",
    headerClassName: "text-right",
    cellClassName: "text-right",
    cell: (row) => (
      <ChronoRowActions
        className="flex justify-end gap-2"
        overflowAfter={4}
        actions={[
          {
            key: "detail",
            label: "Ver detalle",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => onViewDetail?.(row),
            disabled: !onViewDetail,
            variant: "default",
            action: ListaBlancaAction.VER_LISTA_BLANCA,
          },
          {
            key: "edit",
            label: "Editar",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => onEdit?.(row),
            disabled: !onEdit,
            variant: "outline",
            action: ListaBlancaAction.EDITAR_LISTA_BLANCA,
          },
          {
            key: "deactivate",
            label: "Desactivar",
            icon: <Ban className="h-4 w-4" />,
            onClick: () => onDeactivate?.(row),
            disabled: !row.isActive || !onDeactivate,
            disabledReason: !row.isActive ? "Registro inactivo" : undefined,
            variant: "destructive",
            action: ListaBlancaAction.INACTIVAR_LISTA_BLANCA,
          },
        ]}
      />
    ),
  },
];
