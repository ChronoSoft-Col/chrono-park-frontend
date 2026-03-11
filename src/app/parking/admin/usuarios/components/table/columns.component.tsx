"use client";

import type { IUserEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import ChronoButton from "@chrono/chrono-button.component";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/shared/components/ui/tooltip";
import { Eye, Pencil, Trash2 } from "lucide-react";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { UsuariosAction } from "@/src/shared/enums/auth/permissions.enum";

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
                aria-label="Editar usuario"
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
                aria-label="Eliminar usuario"
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
