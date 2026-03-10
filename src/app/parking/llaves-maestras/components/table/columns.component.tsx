"use client";

import type { IMasterKeyEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import ChronoButton from "@chrono/chrono-button.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/shared/components/ui/tooltip";
import { Eye, Ban, Pencil } from "lucide-react";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { LlavesMaestrasAction } from "@/src/shared/enums/auth/permissions.enum";

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
        variant="outline"
        className={
          row.isActive
            ? "border-emerald-500/40 bg-emerald-50 text-emerald-700"
            : "border-border/60 bg-muted/40 text-muted-foreground"
        }
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
      <div className="flex justify-end gap-2">
        <PermissionGuard action={LlavesMaestrasAction.VER_LLAVES_MAESTRAS} hidden>
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

        <PermissionGuard action={LlavesMaestrasAction.EDITAR_LLAVE_MAESTRA} hidden>
          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="outline"
                aria-label="Editar llave"
                onClick={() => onEdit?.(row)}
              >
                <Pencil className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">Editar</TooltipContent>
          </Tooltip>
        </PermissionGuard>

        <PermissionGuard action={LlavesMaestrasAction.INACTIVAR_LLAVE_MAESTRA} hidden>
          {row.isActive && (
            <Tooltip>
              <TooltipTrigger asChild>
                <ChronoButton
                  type="button"
                  variant="destructive"
                  aria-label="Desactivar llave"
                  onClick={() => onDeactivate?.(row)}
                >
                  <Ban className="h-4 w-4" />
                </ChronoButton>
              </TooltipTrigger>
              <TooltipContent side="top">Desactivar</TooltipContent>
            </Tooltip>
          )}
        </PermissionGuard>
      </div>
    ),
  },
];
