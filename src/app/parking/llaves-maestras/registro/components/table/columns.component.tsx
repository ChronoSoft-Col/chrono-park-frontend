"use client";

import type { IMasterKeyLogEntity } from "@/server/domain";
import type { ChronoDataTableColumn } from "@chrono/chrono-data-table.component";
import ChronoButton from "@chrono/chrono-button.component";
import { Eye } from "lucide-react";

const formatDateTime = (value?: Date | string) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const createMasterKeyLogColumns = (
  onViewDetail: (item: IMasterKeyLogEntity) => void,
): ChronoDataTableColumn<IMasterKeyLogEntity>[] => [
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
  {
    id: "actions",
    header: "Acciones",
    align: "center",
    cell: (row) => (
      <ChronoButton
        variant="ghost"
        size="icon"
        onClick={() => onViewDetail(row)}
      >
        <Eye className="h-4 w-4" />
      </ChronoButton>
    ),
  },
];
