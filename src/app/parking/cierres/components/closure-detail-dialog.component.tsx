"use client";

import { IClosureEntity } from "@/server/domain/entities/parking/closure.entity";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChronoSectionLabel } from "@/src/shared/components/chrono-soft/chrono-section-label.component";
import { ChronoValue } from "@/src/shared/components/chrono-soft/chrono-value.component";

interface Props {
  closure: IClosureEntity;
  operatorName?: string;
}

type MethodBucket = {
  total: string;
  data: Record<string, { total: string; count: number }>;
};

type SummaryByMethod = Record<string, MethodBucket>;
type RateSummary = Record<string, { total: string; count: number }>;

const safeFormatDateTime = (value?: string | null) => {
  if (!value) return "-";
  try {
    return format(new Date(value), "dd/MM/yyyy HH:mm", { locale: es });
  } catch {
    return "-";
  }
};

const formatCurrency = (value?: string | null) => {
  if (!value) return "$0.00";
  const parsed = Number(value);
  const safe = Number.isFinite(parsed) ? parsed : 0;
  return `$${safe.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const parseJsonMaybe = <T,>(value: unknown): T | null => {
  if (!value) return null;
  if (typeof value === "object") return value as T;
  if (typeof value !== "string") return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export function ClosureDetailDialog({ closure, operatorName }: Props) {

  const summaryByMethod = parseJsonMaybe<SummaryByMethod>(closure.detail?.summary);
  const rateSummary = parseJsonMaybe<RateSummary>(closure.detail?.rateSummary);

  return (
    <div className="max-h-[70vh] space-y-6 overflow-y-auto px-4">
      {/* Información General */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <ChronoSectionLabel size="sm">Tipo</ChronoSectionLabel>
          <ChronoValue size="md">{closure.closureType === "PARCIAL" ? "Parcial" : "Total"}</ChronoValue>
        </div>
        <div>
          <ChronoSectionLabel size="sm">Creado</ChronoSectionLabel>
          <ChronoValue size="md">{safeFormatDateTime(closure.createdOn)}</ChronoValue>
        </div>
        {operatorName && (
          <div className="sm:col-span-2 lg:col-span-1">
            <ChronoSectionLabel size="sm">Operador</ChronoSectionLabel>
            <ChronoValue size="md">{operatorName}</ChronoValue>
          </div>
        )}
      </div>

      {/* Período del Cierre */}
      <div className="space-y-3 rounded-lg border border-border/60 bg-muted/40 p-4">
        <ChronoSectionLabel size="md">Período del Cierre</ChronoSectionLabel>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ChronoSectionLabel size="xs">Desde</ChronoSectionLabel>
            <ChronoValue size="sm">{safeFormatDateTime(closure.startedAt)}</ChronoValue>
          </div>
          <div>
            <ChronoSectionLabel size="xs">Hasta</ChronoSectionLabel>
            <ChronoValue size="sm">{safeFormatDateTime(closure.finishedAt)}</ChronoValue>
          </div>
        </div>
      </div>

      {/* Totales */}
      <div className="space-y-3 rounded-lg border border-border/60 bg-card/60 p-4">
        <ChronoSectionLabel size="md">Totales</ChronoSectionLabel>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <ChronoSectionLabel size="xs">Total Recaudado</ChronoSectionLabel>
            <ChronoValue size="xl">{formatCurrency(closure.totalCollected)}</ChronoValue>
          </div>
          <div>
            <ChronoSectionLabel size="xs">Registrado</ChronoSectionLabel>
            <ChronoValue size="md">{safeFormatDateTime(closure.detail?.recordedAt ?? null)}</ChronoValue>
          </div>
        </div>
      </div>

      {/* Resumen por método de pago */}
      <div className="space-y-4 rounded-lg border border-border/60 bg-muted/40 p-4">
        <ChronoSectionLabel size="md">Resumen por método de pago</ChronoSectionLabel>

        {!summaryByMethod || Object.keys(summaryByMethod).length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin resumen disponible.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(summaryByMethod).map(([methodName, bucket]) => (
              <div
                key={methodName}
                className="space-y-3 rounded-lg border border-border/60 bg-card/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <ChronoSectionLabel size="sm">{methodName}</ChronoSectionLabel>
                    <span className="text-xs text-muted-foreground">Total del método</span>
                  </div>
                  <ChronoValue size="lg">{formatCurrency(bucket?.total ?? null)}</ChronoValue>
                </div>

                {bucket?.data && Object.keys(bucket.data).length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="min-w-[560px] space-y-2">
                      <div className="grid grid-cols-[minmax(240px,1fr)_120px_160px] gap-3 rounded-md border border-border/60 bg-background/40 p-3">
                        <span className="text-xs text-muted-foreground">Tarifa</span>
                        <span className="text-xs text-muted-foreground">Cantidad</span>
                        <span className="text-right text-xs text-muted-foreground">Total</span>
                      </div>

                      {Object.entries(bucket.data).map(([rateName, rateData]) => (
                        <div
                          key={`${methodName}-${rateName}`}
                          className="grid grid-cols-[minmax(240px,1fr)_120px_160px] gap-3 rounded-md border border-border/60 bg-background/60 p-3"
                        >
                          <div>
                            <ChronoValue size="sm">{rateName}</ChronoValue>
                          </div>
                          <div>
                            <ChronoValue size="sm">{String(rateData?.count ?? 0)}</ChronoValue>
                          </div>
                          <div className="text-right">
                            <ChronoValue size="sm">{formatCurrency(rateData?.total ?? null)}</ChronoValue>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen por tarifa */}
      <div className="space-y-4 rounded-lg border border-border/60 bg-muted/40 p-4">
        <ChronoSectionLabel size="md">Resumen por tarifa</ChronoSectionLabel>

        {!rateSummary || Object.keys(rateSummary).length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin resumen disponible.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[560px] space-y-2">
              <div className="grid grid-cols-[minmax(240px,1fr)_120px_160px] gap-3 rounded-md border border-border/60 bg-background/40 p-3">
                <span className="text-xs text-muted-foreground">Tarifa</span>
                <span className="text-xs text-muted-foreground">Cantidad</span>
                <span className="text-right text-xs text-muted-foreground">Total</span>
              </div>

              {Object.entries(rateSummary).map(([rateName, rateData]) => (
                <div
                  key={rateName}
                  className="grid grid-cols-[minmax(240px,1fr)_120px_160px] gap-3 rounded-md border border-border/60 bg-card/60 p-3"
                >
                  <div>
                    <ChronoValue size="sm">{rateName}</ChronoValue>
                  </div>
                  <div>
                    <ChronoValue size="sm">{String(rateData?.count ?? 0)}</ChronoValue>
                  </div>
                  <div className="text-right">
                    <ChronoValue size="sm">{formatCurrency(rateData?.total ?? null)}</ChronoValue>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
