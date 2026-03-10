"use client";

import type { IMasterKeyLogEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";

const formatDateTime = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const createMasterKeyLogColumns = (): ChronoDataTableColumn<IMasterKeyLogEntity>[] => [
  {
    id: "master-key",
    header: "Llave Maestra",
    accessorFn: (row) => row.masterKey?.key || row.keyId,
  },
  {
    id: "register-device",
    header: "Dispositivo",
    accessorFn: (row) => row.registerDevice?.name || row.registerDeviceId,
  },
  {
    id: "created-at",
    header: "Fecha de uso",
    accessorFn: (row) => formatDateTime(row.createdAt),
  },
];
