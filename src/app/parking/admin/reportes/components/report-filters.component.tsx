"use client";

import { useCallback, useMemo, useState } from "react";
import { useReportStore } from "@/src/shared/stores/report.store";
import { ChronoDatePicker } from "@chrono/chrono-date-picker.component";
import ChronoButton from "@chrono/chrono-button.component";
import { Filter, X } from "lucide-react";
import { IChargeableFilter } from "@/server/domain/entities/parking/reports/params/get-payments-report-params.entity";
import { ChronoBadge } from "@chrono/chrono-badge.component";

function parseLocalDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatISODate(date: Date | undefined): string {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function ReportFiltersComponent() {
  const {
    startDate,
    endDate,
    selectedFilters,
    chargeableOptions,
    isLoading,
    isLoadingOptions,
    setDateRange,
    setSelectedFilters,
    generateReport,
    reset,
  } = useReportStore();

  const [showOptions, setShowOptions] = useState(false);

  const hasActiveFilters = selectedFilters.length > 0;

  const startDateObj = useMemo(() => parseLocalDate(startDate), [startDate]);
  const endDateObj = useMemo(() => parseLocalDate(endDate), [endDate]);

  const handleStartDateChange = useCallback(
    (date: Date | undefined) => setDateRange(formatISODate(date), endDate),
    [endDate, setDateRange],
  );

  const handleEndDateChange = useCallback(
    (date: Date | undefined) => setDateRange(startDate, formatISODate(date)),
    [startDate, setDateRange],
  );

  const handleToggleFilter = useCallback(
    (option: IChargeableFilter) => {
      const exists = selectedFilters.some((f) => f.value === option.value);
      if (exists) {
        setSelectedFilters(selectedFilters.filter((f) => f.value !== option.value));
      } else {
        setSelectedFilters([...selectedFilters, option]);
      }
    },
    [selectedFilters, setSelectedFilters],
  );

  const handleClearFilters = useCallback(() => {
    reset();
    setShowOptions(false);
  }, [reset]);

  const handleGenerate = useCallback(async () => {
    await generateReport();
  }, [generateReport]);

  return (
    <div className="w-full space-y-3 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm">
      <div className="flex flex-wrap items-end justify-end gap-3">
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

        <ChronoButton
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => setShowOptions(!showOptions)}
          disabled={isLoadingOptions}
        >
          <Filter className="mr-2 h-3.5 w-3.5" />
          Filtros {selectedFilters.length > 0 && `(${selectedFilters.length})`}
        </ChronoButton>

        {hasActiveFilters && (
          <ChronoButton
            variant="ghost"
            size="sm"
            className="h-9 text-muted-foreground"
            onClick={handleClearFilters}
          >
            <X className="mr-2 h-3.5 w-3.5" />
            Limpiar filtros
          </ChronoButton>
        )}

        <ChronoButton onClick={handleGenerate} size="sm" className="h-9" loading={isLoading}>
          Generar reporte
        </ChronoButton>
      </div>

      {showOptions && chargeableOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
          <span className="text-xs font-medium text-muted-foreground mr-2 self-center">
            Filtrar por:
          </span>
          {chargeableOptions.map((option) => {
            const isSelected = selectedFilters.some((f) => f.value === option.value);
            return (
              <ChronoBadge
                key={option.value}
                tone={isSelected ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => handleToggleFilter(option)}
              >
                {option.label}
                {isSelected && <X className="ml-1 h-3 w-3" />}
              </ChronoBadge>
            );
          })}
        </div>
      )}
    </div>
  );
}
