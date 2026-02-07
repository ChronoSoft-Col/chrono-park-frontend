"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import type { SubscriptionStatus } from "@/server/domain";

const STATUS_OPTIONS: { value: SubscriptionStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "ACTIVA", label: "Activa" },
  { value: "PERIODO_GRACIA", label: "Período de Gracia" },
  { value: "INACTIVA", label: "Inactiva" },
  { value: "CANCELADA", label: "Cancelada" },
];

export function StatusFilterComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "ALL";

  const handleStatusChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "ALL") {
        params.delete("status");
      } else {
        params.set("status", value);
      }

      // Reset to page 1 when filtering
      params.delete("page");

      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <ChronoSelect value={currentStatus} onValueChange={handleStatusChange}>
      <ChronoSelectTrigger className="w-[200px]">
        <ChronoSelectValue placeholder="Filtrar por estado" />
      </ChronoSelectTrigger>
      <ChronoSelectContent>
        {STATUS_OPTIONS.map((option) => (
          <ChronoSelectItem key={option.value} value={option.value}>
            {option.label}
          </ChronoSelectItem>
        ))}
      </ChronoSelectContent>
    </ChronoSelect>
  );
}
