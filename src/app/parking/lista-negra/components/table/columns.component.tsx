"use client";

import type { IBlackListEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import ChronoButton from "@chrono/chrono-button.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/shared/components/ui/tooltip";
import { Eye, Ban, Pencil } from "lucide-react";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { ListaNegraAction } from "@/src/shared/enums/auth/permissions.enum";

type ViewDetailHandler = (item: IBlackListEntity) => void;
type EditHandler = (item: IBlackListEntity) => void;
type DeactivateHandler = (item: IBlackListEntity) => void;

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

export const createBlackListColumns = (
  onViewDetail?: ViewDetailHandler,
  onEdit?: EditHandler,
  onDeactivate?: DeactivateHandler,
): ChronoDataTableColumn<IBlackListEntity>[] => [
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
      <div className="flex justify-end gap-2">
        <PermissionGuard action={ListaNegraAction.VER_LISTA_NEGRA} hidden>
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

        <PermissionGuard action={ListaNegraAction.EDITAR_LISTA_NEGRA} hidden>
          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="outline"
                aria-label="Editar registro"
                onClick={() => onEdit?.(row)}
              >
                <Pencil className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">Editar</TooltipContent>
          </Tooltip>
        </PermissionGuard>

        <PermissionGuard action={ListaNegraAction.INACTIVAR_LISTA_NEGRA} hidden>
          {row.isActive && (
            <Tooltip>
              <TooltipTrigger asChild>
                <ChronoButton
                  type="button"
                  variant="destructive"
                  aria-label="Desactivar registro"
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
