"use client";

import type { IUserEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { UsuariosAction } from "@/src/shared/enums/auth/permissions.enum";
import { ChronoRowActions } from "@/src/shared/components/chrono-soft/chrono-row-actions.component";

type ViewDetailHandler = (item: IUserEntity) => void;
type EditHandler = (item: IUserEntity) => void;
type DeleteHandler = (item: IUserEntity) => void;

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

export const createUserColumns = (
  onViewDetail?: ViewDetailHandler,
  onEdit?: EditHandler,
  onDelete?: DeleteHandler,
): ChronoDataTableColumn<IUserEntity>[] => [
  {
    id: "full-name",
    header: "Nombre",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`.trim(),
  },
  {
    id: "email",
    header: "Email",
    accessorFn: (row) => row.email,
  },
  {
    id: "document",
    header: "Documento",
    accessorFn: (row) => `${row.documentType?.name ?? ""} ${row.documentNumber}`.trim(),
  },
  {
    id: "role",
    header: "Rol",
    accessorFn: (row) => row.role?.name ?? "-",
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
