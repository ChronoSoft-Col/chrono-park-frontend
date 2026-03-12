"use client";

import { useEffect } from "react";
import { useReportStore } from "@/src/shared/stores/report.store";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import { ChronoViewLayout } from "@chrono/chrono-view-layout.component";
import { FileBarChart } from "lucide-react";
import { ReportFiltersComponent } from "./components/report-filters.component";
import { ReportTableComponent } from "./components/report-table.component";
import { ReportEmailDialogComponent } from "./components/report-email-dialog.component";
import { ReportSummaryComponent } from "./components/report-summary.component";

export default function ReportesPage() {
  const { fetchChargeableOptions } = useReportStore();

  useEffect(() => {
    fetchChargeableOptions();
  }, [fetchChargeableOptions]);

  return (
    <ChronoViewLayout
      title={
        <span className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5 text-primary" />
          Reportes
        </span>
      }
      showAsCard={false}
      description="Generación de reportes de pagos"
      contentClassName="space-y-6"
    >
      <SetupHeaderFilters showDatePicker={false} showDateRangePicker={false} showSearch={false} />

      <ReportFiltersComponent />
      <ReportSummaryComponent />
      <ReportTableComponent />
      <ReportEmailDialogComponent />
    </ChronoViewLayout>
  );
}
