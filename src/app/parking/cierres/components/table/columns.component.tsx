"use client";

import { IClosureListItemEntity } from "@/server/domain/entities/parking/closures/closure-list-item.entity";
import { ChronoDataTableColumn } from "@/src/shared/components/chrono-soft/chrono-data-table.component";
import { Eye, Mail, Printer } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ChronoButton from "@chrono/chrono-button.component";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/shared/components/ui/tooltip";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { CierresAction } from "@/src/shared/enums/auth/permissions.enum";

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  try {
    return format(new Date(value), "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return "-";
  }
};

type ViewDetailHandler = (closure: IClosureListItemEntity) => void;
type PrintHandler = (closure: IClosureListItemEntity) => void;
type SendEmailHandler = (closure: IClosureListItemEntity) => void;

export const createClosureColumns = (
  onViewDetail?: ViewDetailHandler,
  onPrint?: PrintHandler,
  onSendEmail?: SendEmailHandler
): ChronoDataTableColumn<IClosureListItemEntity>[] => [
  {
    id: "closure-type",
    header: "Tipo",
    accessorFn: (row) => (row.closureType === "PARCIAL" ? "Parcial" : "Total"),
  },
  {
    id: "operator-name",
    header: "Operador",
    accessorFn: (row) => row.operatorName,
  },
  {
    id: "started-at",
    header: "Fecha Inicio",
    accessorFn: (row) => formatDateTime(row.startedAt),
  },
  {
    id: "finished-at",
    header: "Fecha Fin",
    accessorFn: (row) => formatDateTime(row.finishedAt),
  },
  {
    id: "created-on",
    header: "Fecha Creación",
    accessorFn: (row) => formatDateTime(row.createdOn),
  },
  {
    id: "actions",
    header: "Acciones",
    align: "right",
    headerClassName: "text-right",
    cellClassName: "text-right",
    cell: (row) => (
      <div className="flex justify-end gap-2">
        <PermissionGuard action={CierresAction.VER_DETALLE_CIERRE} hidden>
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

        {onPrint ? (
          <PermissionGuard action={CierresAction.VER_DETALLE_CIERRE} hidden>
            <Tooltip>
              <TooltipTrigger asChild>
                <ChronoButton
                  type="button"
                  variant="outline"
                  aria-label="Imprimir cierre"
                  onClick={() => onPrint(row)}
                >
                  <Printer className="h-4 w-4" />
                </ChronoButton>
              </TooltipTrigger>
              <TooltipContent side="top">Imprimir</TooltipContent>
            </Tooltip>
          </PermissionGuard>
        ) : null}

        {onSendEmail ? (
          <PermissionGuard action={CierresAction.VER_DETALLE_CIERRE} hidden>
            <Tooltip>
              <TooltipTrigger asChild>
                <ChronoButton
                  type="button"
                  variant="outline"
                  aria-label="Enviar por correo"
                  onClick={() => onSendEmail(row)}
                >
                  <Mail className="h-4 w-4" />
                </ChronoButton>
              </TooltipTrigger>
              <TooltipContent side="top">Enviar</TooltipContent>
            </Tooltip>
          </PermissionGuard>
        ) : null}
      </div>
    ),
  },
];
