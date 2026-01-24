"use client";

import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";
import ChronoButton from "@chrono/chrono-button.component";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { Eye, Printer } from "lucide-react";
import { IPaymentItemEntity } from "@/server/domain";


const formatDateTime = (value?: string) => {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "-";
  }
};

const formatCurrency = (value?: number) => {
  const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(safe);
};

const extractLicensePlate = (payment: IPaymentItemEntity) => {
  const parking = payment.details?.find((d) => d.type === "PARKING");
  const ref = parking?.reference as { licensePlate?: string } | undefined;
  return ref?.licensePlate ?? "-";
};

type ViewDetailHandler = (item: IPaymentItemEntity) => void;
type PrintHandler = (item: IPaymentItemEntity) => void;

export const createPaymentColumns = (
  onViewDetail?: ViewDetailHandler,
  onPrint?: PrintHandler,
): ChronoDataTableColumn<IPaymentItemEntity>[] => [
  {
    id: "payment-date",
    header: "Fecha",
    accessorFn: (row) => formatDateTime(row.paymentDate),
  },
  {
    id: "license-plate",
    header: "Placa",
    accessorFn: (row) => extractLicensePlate(row),
  },
  {
    id: "transaction-id",
    header: "Transacción",
    accessorFn: (row) => row.transactionId || "-",
  },
  {
    id: "method",
    header: "Método",
    accessorFn: (row) => row.paymentMethod?.name ?? "-",
  },
  {
    id: "point",
    header: "Punto",
    accessorFn: (row) => row.paymentPoint?.name ?? "-",
  },
  {
    id: "total",
    header: "Total",
    align: "right",
    headerClassName: "text-right",
    cellClassName: "text-right",
    accessorFn: (row) => formatCurrency(row.totalAmount),
  },
  {
    id: "status",
    header: "Estado",
    accessorFn: (row) => row.status,
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
