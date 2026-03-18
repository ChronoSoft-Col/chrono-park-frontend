"use client";

import { IClosureListItemEntity } from "@/server/domain/entities/parking/closures/closure-list-item.entity";
import { ChronoDataTableColumn } from "@/src/shared/components/chrono-soft/chrono-data-table.component";
import { Eye, Mail, Printer } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CierresAction } from "@/src/shared/enums/auth/permissions.enum";
import { ChronoRowActions } from "@/src/shared/components/chrono-soft/chrono-row-actions.component";

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
            action: CierresAction.VER_DETALLE_CIERRE,
          },
          {
            key: "print",
            label: "Imprimir",
            icon: <Printer className="h-4 w-4" />,
            onClick: () => onPrint?.(row),
            disabled: !onPrint,
            variant: "outline",
            action: CierresAction.VER_DETALLE_CIERRE,
          },
          {
            key: "email",
            label: "Enviar",
            icon: <Mail className="h-4 w-4" />,
            onClick: () => onSendEmail?.(row),
            disabled: !onSendEmail,
            variant: "outline",
            action: CierresAction.VER_DETALLE_CIERRE,
          },
        ]}
      />
    ),
  },
];
