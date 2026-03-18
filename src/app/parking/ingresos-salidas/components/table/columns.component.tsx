"use client"
import { IInOutEntity } from "@/server/domain";
import { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";
import { Eye, PenLine, Printer, RefreshCcw } from "lucide-react";
import { IngresosSalidasAction } from "@/src/shared/enums/auth/permissions.enum";
import { ChronoRowActions } from "@/src/shared/components/chrono-soft/chrono-row-actions.component";

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

type ViewDetailHandler = (item: IInOutEntity) => void;
type PrintHandler = (item: IInOutEntity) => void;
type ChangeRateHandler = (item: IInOutEntity) => void;
type ChangePlateHandler = (item: IInOutEntity) => void;

interface CreateInOutColumnsOptions {
  onViewDetail?: ViewDetailHandler;
  onPrint?: PrintHandler;
  onChangeRate?: ChangeRateHandler;
  showChangeRate?: boolean;
  onChangePlate?: ChangePlateHandler;
  showChangePlate?: boolean;
}

export const createInOutColumns = (
  onViewDetail?: ViewDetailHandler,
  onPrint?: PrintHandler,
  options?: {
    onChangeRate?: ChangeRateHandler;
    showChangeRate?: boolean;
    onChangePlate?: ChangePlateHandler;
    showChangePlate?: boolean;
  },
): ChronoDataTableColumn<IInOutEntity>[] => [
  {
    id: "license-plate",
    header: "Placa",
    accessorFn: (row: IInOutEntity) => row.vehicle.licensePlate,
  },
  {
    id: "vehicle-type",
    header: "Tipo de vehículo",
    accessorFn: (row: IInOutEntity) => row.vehicle.vehicleType.name,
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
      <ChronoRowActions
        className="flex justify-end gap-2"
        overflowAfter={4}
        actions={[
          {
            key: "change-plate",
            label: "Cambiar placa",
            icon: <PenLine className="h-4 w-4" />,
            onClick: () => options?.onChangePlate?.(row),
            disabled: !options?.showChangePlate || !options?.onChangePlate,
            disabledReason: !options?.showChangePlate ? "Acción no disponible" : undefined,
            variant: "outline",
            size: "icon-sm",
            action: IngresosSalidasAction.EDITAR_INGRESOS_SALIDAS,
          },
          {
            key: "change-rate",
            label: "Cambiar tarifa",
            icon: <RefreshCcw className="h-4 w-4" />,
            onClick: () => options?.onChangeRate?.(row),
            disabled: !options?.showChangeRate || !options?.onChangeRate,
            disabledReason: !options?.showChangeRate ? "Acción no disponible" : undefined,
            variant: "outline",
            size: "icon-sm",
            action: IngresosSalidasAction.EDITAR_INGRESOS_SALIDAS,
          },
          {
            key: "detail",
            label: "Ver detalle",
            icon: <Eye className="h-4 w-4" />,
            onClick: () => onViewDetail?.(row),
            disabled: !onViewDetail,
            variant: "secondary",
            size: "icon-sm",
          },
          {
            key: "print",
            label: "Imprimir",
            icon: <Printer className="h-4 w-4" />,
            onClick: () => onPrint?.(row),
            disabled: !onPrint,
            variant: "default",
            size: "icon-sm",
          },
        ]}
      />
    ),
  },
];
