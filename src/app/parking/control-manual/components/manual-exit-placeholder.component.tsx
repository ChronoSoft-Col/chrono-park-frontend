"use client";

import { ChronoBadge } from "@chrono/chrono-badge.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import EmptyState from "@/src/shared/components/empty-state.component";
import { DoorOpen } from "lucide-react";

export default function ManualExitPlaceholderComponent() {
  return (
    <ChronoCard className="flex h-full w-full flex-col">
      <ChronoCardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <ChronoBadge variant="outline" className="text-[11px] font-medium text-muted-foreground">
            Control manual
          </ChronoBadge>
        </div>
        <div>
          <ChronoCardTitle className="text-2xl font-semibold text-foreground">Registrar salida manual</ChronoCardTitle>
          <ChronoCardDescription className="text-sm text-muted-foreground">
            Próximamente: salida manual basada en placa + validación.
          </ChronoCardDescription>
        </div>
      </ChronoCardHeader>

      <ChronoCardContent className="flex min-h-0 flex-1 items-center justify-center">
        <EmptyState
          icon={<DoorOpen className="h-12 w-12 text-muted-foreground" />}
          title="Salida manual en construcción"
          description="Mientras tanto puedes registrar ingresos manuales desde el panel izquierdo."
          className="py-10"
        />
      </ChronoCardContent>
    </ChronoCard>
  );
}
