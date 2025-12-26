"use client"
import { IInOutEntity } from "@/server/domain";
import { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";
import ChronoButton from "@chrono/chrono-button.component";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

type ViewDetailHandler = (item: IInOutEntity) => void;

export const createInOutColumns = (
  onViewDetail?: ViewDetailHandler,
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
      <ChronoButton
        type="button"
        size="sm"
        variant="outline"
        className="text-xs font-semibold"
        onClick={() => onViewDetail?.(row)}
      >
        Ver detalle
      </ChronoButton>
    ),
  },
];
