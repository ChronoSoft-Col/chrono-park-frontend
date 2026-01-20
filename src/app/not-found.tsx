import Link from "next/link";
import { MapPinOff, ParkingCircle, ArrowLeft } from "lucide-react";

import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import ChronoButton from "@chrono/chrono-button.component";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/12 via-background to-muted/20" />
      <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <ChronoCard className="relative w-full max-w-lg overflow-hidden border-border/60 bg-card/90 shadow-xl">
        <ChronoCardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <ChronoCardTitle className="text-xl font-semibold">
                Página no encontrada
              </ChronoCardTitle>
              <ChronoCardDescription>
                La ruta que buscas no existe o fue movida.
              </ChronoCardDescription>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <MapPinOff className="h-5 w-5" />
            </div>
          </div>
        </ChronoCardHeader>

        <ChronoCardContent className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ParkingCircle className="h-4 w-4" />
              <p className="text-xs">
                Puedes volver al módulo de parqueadero y continuar tu flujo.
              </p>
            </div>

            <p className="mt-2 text-4xl font-extrabold tracking-tight text-foreground">
              404
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <ChronoButton asChild variant="outline" className="w-full sm:w-auto" icon={<ArrowLeft className="h-4 w-4" />}>
              <Link href="/parking">Volver a inicio</Link>
            </ChronoButton>
          </div>
        </ChronoCardContent>
      </ChronoCard>
    </main>
  );
}
