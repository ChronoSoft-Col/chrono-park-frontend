"use client";

import type { ICustomerEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

import ChronoButton from "@chrono/chrono-button.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/shared/components/ui/tooltip";
import { Eye, Ban, CheckCircle2, Pencil } from "lucide-react";

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
        variant="outline"
        className={row.isActive ? "border-emerald-500/40 bg-emerald-50 text-emerald-700" : "border-border/60 bg-muted/40 text-muted-foreground"}
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

        <Tooltip>
          <TooltipTrigger asChild>
            <ChronoButton
              type="button"
              variant="outline"
              aria-label="Editar cliente"
              onClick={() => onEdit?.(row)}
            >
              <Pencil className="h-4 w-4" />
            </ChronoButton>
          </TooltipTrigger>
          <TooltipContent side="top">Editar</TooltipContent>
        </Tooltip>

        {row.isActive ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="destructive"
                aria-label="Desactivar cliente"
                onClick={() => onToggleActive?.(row, false)}
              >
                <Ban className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">Desactivar</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <ChronoButton
                type="button"
                variant="outline"
                aria-label="Activar cliente"
                onClick={() => onToggleActive?.(row, true)}
              >
                <CheckCircle2 className="h-4 w-4" />
              </ChronoButton>
            </TooltipTrigger>
            <TooltipContent side="top">Activar</TooltipContent>
          </Tooltip>
        )}
      </div>
    ),
  },
];
