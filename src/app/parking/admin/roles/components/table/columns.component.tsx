"use client";

import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";
import type { IRoleEntity } from "@/server/domain";

import { ChronoBadge } from "@chrono/chrono-badge.component";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { UsuariosAction } from "@/src/shared/enums/auth/permissions.enum";
import { ChronoRowActions } from "@/src/shared/components/chrono-soft/chrono-row-actions.component";

type ViewDetailHandler = (item: IRoleEntity) => void;
type EditHandler = (item: IRoleEntity) => void;
type DeleteHandler = (item: IRoleEntity) => void;

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

export const createRoleColumns = (
  onViewDetail?: ViewDetailHandler,
  onEdit?: EditHandler,
  onDelete?: DeleteHandler,
): ChronoDataTableColumn<IRoleEntity>[] => [
  {
    id: "name",
    header: "Nombre",
    accessorFn: (row) => row.name,
  },
  {
    id: "description",
    header: "Descripción",
    accessorFn: (row) => row.description ?? "-",
  },
  {
    id: "status",
    header: "Estado",
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
            action: UsuariosAction.VER_USUARIOS,
          },
          {
            key: "edit",
            label: "Editar",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => onEdit?.(row),
            disabled: !onEdit,
            variant: "outline",
            action: UsuariosAction.EDITAR_USUARIOS,
          },
          {
            key: "delete",
            label: "Eliminar",
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => onDelete?.(row),
            disabled: !onDelete,
            variant: "destructive",
            action: UsuariosAction.INACTIVAR_USUARIOS,
          },
        ]}
      />
    ),
  },
];
