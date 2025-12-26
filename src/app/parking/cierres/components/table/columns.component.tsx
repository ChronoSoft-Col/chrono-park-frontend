"use client";

import { IClosureListItemEntity } from "@/server/domain/entities/parking/closure-list-item.entity";
import { ChronoDataTableColumn } from "@/src/shared/components/chrono-soft/chrono-data-table.component";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ChronoButton from "@chrono/chrono-button.component";

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  try {
    return format(new Date(value), "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return "-";
  }
};

type ViewDetailHandler = (closure: IClosureListItemEntity) => void;

export const createClosureColumns = (
  onViewDetail?: ViewDetailHandler
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
      <ChronoButton
        variant="outline"
        size="sm"
        onClick={() => onViewDetail?.(row)}
        className="text-xs font-semibold"
        icon={<Eye className="h-4 w-4" />}
      >
        Ver
      </ChronoButton>
    ),
  },
];
