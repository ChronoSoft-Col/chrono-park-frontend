"use client";

import { useReportStore } from "@/src/shared/stores/report.store";
import { ChronoDataTable, type ChronoDataTableColumn } from "@chrono/chrono-data-table.component";
import { IPaymentReportItem } from "@/server/domain/entities/parking/reports/response/payments-report-response.entity";
import EmptyState from "@/src/shared/components/empty-state.component";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { Button } from "@/src/shared/components/ui/button";
import { exportReportToExcel } from "@/src/lib/utils/export-excel.util";
import { AlertCircle, Download, FileBarChart, SearchX } from "lucide-react";

const columns: ChronoDataTableColumn<IPaymentReportItem>[] = [
  {
    accessorKey: "index",
    header: "#",
    align: "center",
    cell: (row) => `#${row.index}`,
  },
  {
    accessorKey: "consecutive",
    header: "Consecutivo",
  },
  {
    accessorKey: "totalFormatted",
    header: "Total",
    align: "right",
  },
  {
    accessorKey: "dateFormatted",
    header: "Fecha",
  },
  {
    header: "Conceptos",
    cell: (row) => (
      <div className="flex flex-col gap-0.5">
        {row.details.map((detail, i) => (
          <span key={i} className="text-xs">
            {detail.concept}: <span className="font-medium">${detail.amount.toLocaleString()}</span>
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Método de pago",
  },
  {
    accessorKey: "notes",
    header: "Notas",
    cell: (row) => row.notes || "—",
  },
];

export function ReportTableComponent() {
  const { reportData, responseType, isLoading, error, startDate, endDate } = useReportStore();

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-sm font-medium">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (responseType !== "data" || !reportData) {
    if (responseType === null) {
      return (
        <EmptyState
          icon={<FileBarChart className="h-10 w-10 text-muted-foreground mb-2" />}
          title="Sin datos"
          description="Selecciona un rango de fechas y genera el reporte"
        />
      );
    }
    return null;
  }

  if (reportData.payments.length === 0) {
    return (
      <EmptyState
        icon={<SearchX className="h-10 w-10 text-muted-foreground mb-2" />}
        title="Sin resultados"
        description="No se encontraron pagos en el rango seleccionado"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportReportToExcel(reportData, startDate, endDate)}
        >
          <Download />
          Descargar Excel
        </Button>
      </div>
      <ChronoDataTable
        data={reportData.payments}
        columns={columns}
        getRowKey={(row) => row.consecutive}
      />
    </div>
  );
}
