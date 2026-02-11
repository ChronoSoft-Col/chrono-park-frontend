"use client";

import * as React from "react";

import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import { IPaymentItemEntity } from "@/server/domain";

interface Props {
  item: IPaymentItemEntity;
}

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  try {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return "-";
  }
};

const formatCurrency = (value?: number) => {
  const safe = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(safe);
};

const getDetailTypeLabel = (type: string) => {
  switch (type) {
    case "PARKING":
      return "Parqueo";
    case "SERVICE":
      return "Servicio";
    case "OTHER":
      return "Otro";
    default:
      return type;
  }
};

const getDetailDescription = (detail: IPaymentItemEntity["details"][0]) => {
  if (!detail.reference) return null;
  
  if ("name" in detail.reference) {
    return detail.reference.name;
  }
  
  return null;
};

export function PaymentDetailDialogContent({ item }: Props) {
  const plate = React.useMemo(() => {
    const parking = item.details?.find((d) => d.type === "PARKING");
    const ref = parking?.reference as { licensePlate?: string } | undefined;
    return ref?.licensePlate ?? "-";
  }, [item.details]);

  const headerRows = [
    { label: "ID pago", value: item.id },
    { label: "Transacción", value: item.transactionId || "-" },
    { label: "Placa", value: plate },
    { label: "Fecha", value: formatDateTime(item.paymentDate) },
    { label: "Método", value: item.paymentMethod?.name ?? "-" },
    { label: "Punto", value: item.paymentPoint?.name ?? "-" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <ChronoSectionLabel size="base" className="tracking-[0.25em]">
            Pago
          </ChronoSectionLabel>
          <ChronoValue size="xl">{formatCurrency(item.totalAmount)}</ChronoValue>
        </div>
        <ChronoBadge variant="outline" className="text-xs font-semibold">
          {item.status}
        </ChronoBadge>
      </div>

      <ChronoSeparator />

      <dl className="grid gap-4 sm:grid-cols-2">
        {headerRows.map((row) => (
          <InfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </dl>

      <ChronoSeparator />

      <div className="space-y-3">
        <ChronoSectionLabel size="sm">Totales</ChronoSectionLabel>
        <dl className="grid gap-4 sm:grid-cols-3">
          <InfoRow label="Base gravable" value={formatCurrency(item.taxableAmount)} />
          <InfoRow label="Impuestos" value={formatCurrency(item.taxAmount)} />
          <InfoRow label="Total" value={formatCurrency(item.totalAmount)} />
        </dl>
      </div>

      <div className="space-y-3">
        <ChronoSectionLabel size="sm">Detalle</ChronoSectionLabel>
        <div className="space-y-2">
          {(item.details ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">(Sin detalle)</p>
          ) : (
            item.details.map((detail) => {
              const typeLabel = getDetailTypeLabel(detail.type);
              const description = getDetailDescription(detail);

              return (
                <div
                  key={detail.id}
                  className="rounded-xl border border-border/60 bg-card/70 px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ChronoBadge variant="outline" className="text-xs">
                        {typeLabel}
                      </ChronoBadge>
                      {description && (
                        <span className="text-sm font-medium">{description}</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(detail.amount)}</p>
                  </div>
                  {detail.reference && "licensePlate" in detail.reference && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Placa: {detail.reference.licensePlate}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {item.notes ? (
        <div className="space-y-2">
          <ChronoSectionLabel size="sm">Notas</ChronoSectionLabel>
          <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm">
            {item.notes}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 px-4 py-3 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-base font-semibold text-foreground break-all">{value}</p>
    </div>
  );
}
