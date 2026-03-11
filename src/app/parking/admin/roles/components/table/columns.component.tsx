"use client";

import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";
import type { IRoleEntity } from "@/server/domain";

import ChronoButton from "@chrono/chrono-button.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/shared/components/ui/tooltip";
import { Eye, Pencil, Trash2 } from "lucide-react";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { UsuariosAction } from "@/src/shared/enums/auth/permissions.enum";

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
      <div className="flex justify-end gap-2">
        <PermissionGuard action={UsuariosAction.VER_USUARIOS} hidden>
          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="default"
                aria-label="Ver detalle"
                onClick={() => onViewDetail?.(row)}
              >
                <Eye className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">Ver detalle</TooltipContent>
          </Tooltip>
        </PermissionGuard>

        <PermissionGuard action={UsuariosAction.EDITAR_USUARIOS} hidden>
          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="outline"
                aria-label="Editar rol"
                onClick={() => onEdit?.(row)}
              >
                <Pencil className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">Editar</TooltipContent>
          </Tooltip>
        </PermissionGuard>

        <PermissionGuard action={UsuariosAction.INACTIVAR_USUARIOS} hidden>
          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="destructive"
                aria-label="Eliminar rol"
                onClick={() => onDelete?.(row)}
              >
                <Trash2 className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">Eliminar</TooltipContent>
          </Tooltip>
        </PermissionGuard>
      </div>
    ),
  },
];
