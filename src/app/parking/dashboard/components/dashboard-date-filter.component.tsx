"use client";

import { useCallback, useMemo } from "react";
import { useDashboardStore } from "@/src/shared/stores/dashboard.store";
import { TDashboardGroupBy } from "@/server/domain/entities/parking/dashboard/params/dashboard-grouped-params.entity";
import { Filter } from "lucide-react";
import { ChronoDatePicker } from "@chrono/chrono-date-picker.component";
import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";

const GROUP_BY_OPTIONS: { value: TDashboardGroupBy; label: string }[] = [
  { value: "hour", label: "Por hora" },
  { value: "day", label: "Por día" },
  { value: "week", label: "Por semana" },
  { value: "month", label: "Por mes" },
];

/** Parse "YYYY-MM-DD" → Date (local timezone) */
function parseLocalDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Date → "YYYY-MM-DD" */
function formatISODate(date: Date | undefined): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function DashboardDateFilterComponent() {
  const { startDate, endDate, groupBy, setDateRange, setGroupBy, fetchDateRangeData } =
    useDashboardStore();

  const startDateObj = useMemo(() => parseLocalDate(startDate), [startDate]);
  const endDateObj = useMemo(() => parseLocalDate(endDate), [endDate]);

  const handleStartDateChange = useCallback(
    (date: Date | undefined) => {
      setDateRange(formatISODate(date), endDate);
    },
    [endDate, setDateRange],
  );

  const handleEndDateChange = useCallback(
    (date: Date | undefined) => {
      setDateRange(startDate, formatISODate(date));
    },
    [startDate, setDateRange],
  );

  const handleGroupByChange = useCallback(
    (value: string) => {
      setGroupBy(value as TDashboardGroupBy);
    },
    [setGroupBy],
  );

  const handleApplyFilters = useCallback(async () => {
    await fetchDateRangeData();
  }, [fetchDateRangeData]);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Desde</label>
        <ChronoDatePicker
          date={startDateObj}
          onDateChange={handleStartDateChange}
          placeholder="Fecha inicio"
          dateFormat="dd MMM yyyy"
          toDate={endDateObj}
          className="h-9 w-[180px]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Hasta</label>
        <ChronoDatePicker
          date={endDateObj}
          onDateChange={handleEndDateChange}
          placeholder="Fecha fin"
          dateFormat="dd MMM yyyy"
          fromDate={startDateObj}
          toDate={new Date()}
          className="h-9 w-[180px]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Agrupar por</label>
        <ChronoSelect value={groupBy} onValueChange={handleGroupByChange}>
          <ChronoSelectTrigger className="h-9 w-[140px]">
            <ChronoSelectValue />
          </ChronoSelectTrigger>
          <ChronoSelectContent>
            {GROUP_BY_OPTIONS.map((opt) => (
              <ChronoSelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </ChronoSelectItem>
            ))}
          </ChronoSelectContent>
        </ChronoSelect>
      </div>

      <ChronoButton
        onClick={handleApplyFilters}
        size="sm"
        className="h-9"
      >
        <Filter className="mr-2 h-3.5 w-3.5" />
        Aplicar
      </ChronoButton>
    </div>
  );
}
