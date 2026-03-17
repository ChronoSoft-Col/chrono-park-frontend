"use client";

import type { IMasterKeyLogEntity } from "@/server/domain";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ChronoValue } from "@chrono/chrono-value.component";

interface Props {
  item: IMasterKeyLogEntity;
}

const formatDateTime = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export function MasterKeyLogDetailDialogContent({ item }: Props) {
  const rows = [
    { label: "Llave Maestra", value: item.masterKey?.key || item.keyId },
    { label: "Dispositivo", value: item.registerDevice?.name || item.registerDeviceId },
    { label: "Fecha de uso", value: formatDateTime(item.createdAt) },
  ];

  return (
    <div className="space-y-5">
      <div>
        <ChronoSectionLabel size="base" className="tracking-[0.25em]">
          Registro de Uso
        </ChronoSectionLabel>
        <ChronoValue size="xl">{item.masterKey?.key || "Llave"}</ChronoValue>
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
