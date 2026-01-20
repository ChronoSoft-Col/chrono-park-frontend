"use client";

import * as React from "react";

import type { ICustomerEntity } from "@/server/domain";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ChronoValue } from "@chrono/chrono-value.component";

interface CustomersDetailDialogContentProps {
  item: ICustomerEntity;
}

export function CustomersDetailDialogContent({ item }: CustomersDetailDialogContentProps) {
  const vehicles = item.vehicles ?? [];

  const headerRows = [
    { label: "Documento", value: `${item.documentType?.shortName ?? item.documentType?.name ?? ""} ${item.documentNumber}`.trim() },
    { label: "Email", value: item.email || "-" },
    { label: "Teléfono", value: item.phoneNumber || "-" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ChronoSectionLabel size="base" className="tracking-[0.25em]">
            Cliente
          </ChronoSectionLabel>
          <ChronoValue size="xl">{item.fullName || `${item.firstName} ${item.lastName}`.trim()}</ChronoValue>
        </div>

        <ChronoBadge
          variant="outline"
          className={item.isActive ? "border-emerald-500/40 bg-emerald-50 text-emerald-700" : "border-border/60 bg-muted/40 text-muted-foreground"}
        >
          {item.isActive ? "Activo" : "Inactivo"}
        </ChronoBadge>
      </div>

      <ChronoSeparator />

      <dl className="grid gap-4 sm:grid-cols-2">
        {headerRows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
            Vehículos
          </ChronoSectionLabel>
          <span className="text-xs text-muted-foreground">{vehicles.length} registrados</span>
        </div>

        {vehicles.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Placa</p>
                <p className="text-base font-semibold text-foreground">{vehicle.licensePlate || "-"}</p>
                <p className="mt-1 text-xs text-muted-foreground">{vehicle.vehicleTypeName || "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-4 text-center text-xs text-muted-foreground">
            Sin vehículos asociados.
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}
