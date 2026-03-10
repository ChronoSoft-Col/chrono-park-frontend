"use client";

import type { IWhiteListEntity } from "@/server/domain";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ChronoValue } from "@chrono/chrono-value.component";

interface Props {
  item: IWhiteListEntity;
}

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

export function WhiteListDetailDialogContent({ item }: Props) {
  const rows = [
    { label: "Vehículo", value: item.vehicle?.licensePlate || "-" },
    { label: "Cliente", value: item.customer?.fullName || "-" },
    { label: "Razón", value: item.reason },
    { label: "Fecha inicio", value: formatDate(item.startDate) },
    { label: "Fecha fin", value: item.endDate ? formatDate(item.endDate) : "Indefinida" },
    { label: "Creado", value: formatDate(item.createdAt) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ChronoSectionLabel size="base" className="tracking-[0.25em]">
            Lista Blanca
          </ChronoSectionLabel>
          <ChronoValue size="xl">{item.reason}</ChronoValue>
        </div>

        <ChronoBadge
          variant="outline"
          className={
            item.isActive
              ? "border-emerald-500/40 bg-emerald-50 text-emerald-700"
              : "border-border/60 bg-muted/40 text-muted-foreground"
          }
        >
          {item.isActive ? "Activo" : "Inactivo"}
        </ChronoBadge>
      </div>

      <ChronoSeparator />

      <dl className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{row.label}</p>
            <p className="text-base font-semibold text-foreground">{row.value}</p>
          </div>
        ))}
      </dl>
    </div>
  );
}
