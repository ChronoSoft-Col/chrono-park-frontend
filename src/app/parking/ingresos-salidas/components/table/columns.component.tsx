"use client"
import { IInOutEntity } from "@/server/domain";
import { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";
import ChronoButton from "@chrono/chrono-button.component";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/shared/components/ui/tooltip";
import { Eye, Printer } from "lucide-react";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

type ViewDetailHandler = (item: IInOutEntity) => void;
type PrintHandler = (item: IInOutEntity) => void;

export const createInOutColumns = (
  onViewDetail?: ViewDetailHandler,
  onPrint?: PrintHandler,
): ChronoDataTableColumn<IInOutEntity>[] => [
  {
    id: "license-plate",
    header: "Placa",
    accessorFn: (row: IInOutEntity) => row.vehicle.licensePlate,
  },
  {
    id: "vehicle-type",
    header: "Tipo de vehículo",
    accessorFn: (row: IInOutEntity) => {
      console.log(row);
      return row.vehicle.vehicleType.name;
    },
  },
  {
    id: "rate-profile",
    header: "Perfil tarifario",
    accessorFn: (row: IInOutEntity) => row.rateProfile.name,
  },
  {
    id: "entry-time",
    header: "Entrada",
    accessorFn: (row: IInOutEntity) => formatDateTime(row.entryTime),
  },
  {
    id: "exit-time",
    header: "Salida",
    accessorFn: (row: IInOutEntity) => formatDateTime(row.exitTime),
  },
  {
    id: "actions",
    header: "Acciones",
    align: "right",
    headerClassName: "text-right",
    cellClassName: "text-right",
    cell: (row: IInOutEntity) => (
      <div className="flex justify-end gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <ChronoButton
              type="button"
              size="icon-sm"
              variant="secondary"
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
              size="icon-sm"
              variant="default"
              aria-label="Imprimir"
              onClick={() => onPrint?.(row)}
            >
              <Printer className="h-4 w-4" />
            </ChronoButton>
          </TooltipTrigger>
          <TooltipContent side="top">Imprimir</TooltipContent>
        </Tooltip>
      </div>
    ),
  },
];
