"use client";

import type { IMasterKeyEntity } from "@/server/domain";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ChronoValue } from "@chrono/chrono-value.component";

interface Props {
  item: IMasterKeyEntity;
}

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(date);
};

export function MasterKeyDetailDialogContent({ item }: Props) {
  const rows = [
    { label: "Llave", value: item.key },
    { label: "Creado", value: formatDate(item.createdAt) },
    { label: "Actualizado", value: formatDate(item.updatedAt) },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ChronoSectionLabel size="base" className="tracking-[0.25em]">
            Llave Maestra
          </ChronoSectionLabel>
          <ChronoValue size="xl">{item.key}</ChronoValue>
        </div>

        <ChronoBadge
          variant="outline"
          className={
            item.isActive
              ? "border-emerald-500/40 bg-emerald-50 text-emerald-700"
              : "border-border/60 bg-muted/40 text-muted-foreground"
          }
        >
          {item.isActive ? "Activa" : "Inactiva"}
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
