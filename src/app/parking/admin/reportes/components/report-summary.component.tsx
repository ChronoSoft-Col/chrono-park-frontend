"use client";

import { useReportStore } from "@/src/shared/stores/report.store";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import { DollarSign, FileText } from "lucide-react";

export function ReportSummaryComponent() {
  const { reportData, responseType } = useReportStore();

  if (responseType !== "data" || !reportData) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <ChronoCard>
        <ChronoCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <ChronoCardTitle className="text-sm font-medium">Total de pagos</ChronoCardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </ChronoCardHeader>
        <ChronoCardContent>
          <div className="text-2xl font-bold">{reportData.totalPayments}</div>
        </ChronoCardContent>
      </ChronoCard>

      <ChronoCard>
        <ChronoCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <ChronoCardTitle className="text-sm font-medium">Monto total</ChronoCardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </ChronoCardHeader>
        <ChronoCardContent>
          <div className="text-2xl font-bold">{reportData.totalAmountFormatted}</div>
        </ChronoCardContent>
      </ChronoCard>
    </div>
  );
}
