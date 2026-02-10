"use client";

import * as React from "react";

import { IInOutEntity } from "@/server/domain";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { useCommonStore } from "@/src/shared/stores/common.store";

interface InOutDetailDialogContentProps {
  item: IInOutEntity;
}

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export function InOutDetailDialogContent({ item }: InOutDetailDialogContentProps) {
  const vehicleTypes = useCommonStore((s) => s.vehicleTypes);
  const isClosed = Boolean(item.exitTime);

  const vehicleTypeLabel = React.useMemo(() => {
    const fromCatalog = vehicleTypes.find((type) => type.value === item.vehicle.vehicleType.id);
    return fromCatalog?.label ?? item.vehicle.vehicleType.name;
  }, [item.vehicle.vehicleType.id, item.vehicle.vehicleType.name, vehicleTypes]);

  const detailRows = [
    { label: "Placa", value: item.vehicle.licensePlate },
    { label: "Tipo de vehículo", value: vehicleTypeLabel },
    { label: "Perfil tarifario", value: item.rateProfile.name },
    { label: "Estado", value: isClosed ? "Completado" : "En curso" },
  ];

  const timeRows = [
    { label: "Ingreso", value: formatDateTime(item.entryTime) },
    {
      label: "Salida",
      value: isClosed ? formatDateTime(item.exitTime) : "Aún en operación",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ChronoSectionLabel size="base" className="tracking-[0.25em]">
            Placa
          </ChronoSectionLabel>
          <ChronoValue size="xl">
            {item.vehicle.licensePlate}
          </ChronoValue>
        </div>
        <ChronoBadge variant="outline" className="text-xs font-semibold">
          {vehicleTypeLabel}
        </ChronoBadge>
      </div>

      <ChronoSeparator />
      <dl className="grid gap-4 sm:grid-cols-2">
        {detailRows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>

      <dl className="grid gap-4 sm:grid-cols-2">
        {timeRows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
