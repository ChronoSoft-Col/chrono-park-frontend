"use client";

import type { IUserEntity } from "@/server/domain";

interface Props {
  item: IUserEntity;
}

const formatDate = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", { dateStyle: "long", timeStyle: "short" }).format(date);
};

export function UserDetailDialogContent({ item }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DetailField label="Nombre" value={`${item.firstName} ${item.lastName}`} />
        <DetailField label="Email" value={item.email} />
        <DetailField label="Tipo de documento" value={item.documentType?.name ?? "-"} />
        <DetailField label="Número de documento" value={item.documentNumber} />
        <DetailField label="Rol" value={item.role?.name ?? "-"} />
        <DetailField label="Fecha de creación" value={formatDate(item.createdAt)} />
      </div>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/80 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}
