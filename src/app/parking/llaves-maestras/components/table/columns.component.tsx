"use client";

import type { IMasterKeyEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import { ChronoBadge } from "@chrono/chrono-badge.component";
import { Eye, Ban, Pencil } from "lucide-react";
import { LlavesMaestrasAction } from "@/src/shared/enums/auth/permissions.enum";
import { ChronoRowActions } from "@/src/shared/components/chrono-soft/chrono-row-actions.component";

type ViewDetailHandler = (item: IMasterKeyEntity) => void;
type EditHandler = (item: IMasterKeyEntity) => void;
type DeactivateHandler = (item: IMasterKeyEntity) => void;

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

export const createMasterKeyColumns = (
  onViewDetail?: ViewDetailHandler,
  onEdit?: EditHandler,
  onDeactivate?: DeactivateHandler,
): ChronoDataTableColumn<IMasterKeyEntity>[] => [
  {
    id: "key",
    header: "Llave",
    accessorFn: (row) => row.key,
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
        {row.isActive ? "Activa" : "Inactiva"}
      </ChronoBadge>
    ),
  },
  {
    id: "created-at",
    header: "Creado",
    accessorFn: (row) => formatDate(row.createdAt),
  },
  {
    id: "updated-at",
    header: "Actualizado",
    accessorFn: (row) => formatDate(row.updatedAt),
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
            action: LlavesMaestrasAction.VER_LLAVES_MAESTRAS,
          },
          {
            key: "edit",
            label: "Editar",
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => onEdit?.(row),
            disabled: !onEdit,
            variant: "outline",
            action: LlavesMaestrasAction.EDITAR_LLAVE_MAESTRA,
          },
          {
            key: "deactivate",
            label: "Desactivar",
            icon: <Ban className="h-4 w-4" />,
            onClick: () => onDeactivate?.(row),
            disabled: !row.isActive || !onDeactivate,
            disabledReason: !row.isActive ? "Llave inactiva" : undefined,
            variant: "destructive",
            action: LlavesMaestrasAction.INACTIVAR_LLAVE_MAESTRA,
          },
        ]}
      />
    ),
  },
];
