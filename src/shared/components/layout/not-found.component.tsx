import Link from "next/link";
import { ArrowLeft, ParkingCircle, MapPinned, TrafficCone } from "lucide-react";

import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardFooter,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { cn } from "@/src/lib/utils";

type NotFoundProps = {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

export default function NotFoundComponent({
  title = "Página no encontrada",
  description = "La ruta que buscas no existe o fue movida.",
  backHref = "/parking",
  backLabel = "Volver a inicio",
  className,
}: NotFoundProps) {
  return (
    <main
      className={cn(
        "relative flex h-dvh items-center justify-center overflow-hidden px-4 py-10",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/18 via-background to-muted/25" />
      <div className="pointer-events-none absolute left-1/2 top-[-140px] h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-primary/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-140px] h-[360px] w-[360px] rounded-full bg-primary/10 blur-3xl" />

      <ChronoCard className="relative w-full max-w-2xl overflow-hidden border-border/60 bg-card/90 shadow-xl">
        <div className="absolute inset-0 opacity-[0.20]">
          <div className="absolute left-0 top-0 h-full w-2 bg-linear-to-b from-transparent via-primary/60 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-2 bg-linear-to-b from-transparent via-primary/60 to-transparent" />
        </div>

        <ChronoCardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <ChronoSectionLabel size="xs">Chrono Park</ChronoSectionLabel>
              <ChronoCardTitle className="text-2xl font-semibold tracking-tight">
                {title}
              </ChronoCardTitle>
              <ChronoCardDescription className="text-sm">
                {description}
              </ChronoCardDescription>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-sm">
                <MapPinned className="h-5 w-5" />
              </div>
              <div className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-background/50 text-muted-foreground shadow-sm sm:flex">
                <TrafficCone className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-4">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <ChronoSectionLabel size="xs">Código</ChronoSectionLabel>
                <p className="mt-1 text-6xl font-black tracking-tight text-foreground">
                  404
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  No pudimos ubicar esta entrada en el parqueadero.
                </p>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-primary/10 blur-xl" />
                <div className="relative rounded-3xl border border-primary/20 bg-linear-to-br from-primary/15 via-background to-background p-4 shadow-inner">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ParkingCircle className="h-4 w-4" />
                    <span className="text-xs">Ruta sugerida</span>
                  </div>
                      <p className="text-sm font-semibold text-foreground">{backHref}</p>
                    <p className="text-sm font-semibold text-foreground">/parking</p>
                    <p className="text-[11px] text-muted-foreground">Módulo principal</p>
                  </div>
                </div>
              </div>
          </div>
        </ChronoCardHeader>

        <ChronoCardFooter>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end z-50">
            <ChronoButton
              asChild
              variant="outline"
              className="w-full sm:w-auto"
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              <Link href={backHref}>{backLabel}</Link>
            </ChronoButton>
          </div>
        </ChronoCardFooter>
      </ChronoCard>
    </main>
  );
}
