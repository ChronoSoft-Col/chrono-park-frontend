"use client";

import type { ICustomerEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import { ChronoBadge } from "@chrono/chrono-badge.component";
import { Eye, Ban, CheckCircle2, Pencil } from "lucide-react";
import { ClientesAction } from "@/src/shared/enums/auth/permissions.enum";
import { ChronoRowActions } from "@/src/shared/components/chrono-soft/chrono-row-actions.component";

type ViewDetailHandler = (item: ICustomerEntity) => void;
type ToggleActiveHandler = (item: ICustomerEntity, nextActive: boolean) => void;
type DeleteHandler = (item: ICustomerEntity) => void;
type EditHandler = (item: ICustomerEntity) => void;

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

export const createCustomerColumns = (
  onViewDetail?: ViewDetailHandler,
  onToggleActive?: ToggleActiveHandler,
  onDelete?: DeleteHandler,
  onEdit?: EditHandler,
): ChronoDataTableColumn<ICustomerEntity>[] => [
  {
    id: "full-name",
    header: "Cliente",
    accessorFn: (row) => row.fullName || `${row.firstName} ${row.lastName}`.trim(),
  },
  {
    id: "document",
    header: "Documento",
    accessorFn: (row) => `${row.documentType?.shortName ?? row.documentType?.name ?? ""} ${row.documentNumber}`.trim(),
  },
  {
    id: "email",
    header: "Email",
    accessorFn: (row) => row.email || "-",
  },
  {
    id: "phone",
    header: "Teléfono",
    accessorFn: (row) => row.phoneNumber || "-",
  },
  {
    id: "vehicles",
    header: "Vehículos",
    align: "center",
    headerClassName: "text-center",
    cellClassName: "text-center",
    accessorFn: (row) => row.vehicles?.length ?? 0,
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
            action: ClientesAction.VER_DETALLES_CLIENTE,
          },
          {
            key: "edit",
            label: "Editar",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => onEdit?.(row),
            disabled: !onEdit,
            variant: "outline",
            action: ClientesAction.EDITAR_CLIENTE,
          },
          {
            key: "toggle-active",
            label: row.isActive ? "Desactivar" : "Activar",
            icon: row.isActive ? (
              <Ban className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            ),
            onClick: () => onToggleActive?.(row, !row.isActive),
            disabled: !onToggleActive,
            variant: row.isActive ? "destructive" : "outline",
            action: ClientesAction.ELIMINAR_CLIENTE,
          },
        ]}
      />
    ),
  },
];
