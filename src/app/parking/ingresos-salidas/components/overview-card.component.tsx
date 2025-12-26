
import {
  ChronoCard,
  ChronoCardHeader,
  ChronoCardTitle,
  ChronoCardDescription,
  ChronoCardContent,
} from "@chrono/chrono-card.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";

export function InOutOverviewCard() {
  return (
    <ChronoCard className="border-border/60 bg-card/90 shadow-sm">
      <ChronoCardHeader className="gap-1.5 px-5 pb-3 pt-4">
        <ChronoSectionLabel size="md" className="text-primary">
          Resumen
        </ChronoSectionLabel>
        <ChronoCardTitle className="text-2xl lg:text-3xl">Ingresos &amp; salidas</ChronoCardTitle>
        <ChronoCardDescription className="max-w-3xl text-sm">
          Visualiza en un mismo lugar el detalle de cada vehículo, su tarifa aplicada y el estado de ocupación del parqueadero.
        </ChronoCardDescription>
      </ChronoCardHeader>
      <ChronoCardContent className="px-5 pb-3 pt-0 text-xs text-muted-foreground">
        Controla la operación diaria con métricas en vivo y prepara reportes históricos sin salir de este módulo.
      </ChronoCardContent>
    </ChronoCard>
  );
}
