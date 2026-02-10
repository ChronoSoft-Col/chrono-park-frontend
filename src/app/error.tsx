"use client";

import { useMemo } from "react";
import Link from "next/link";
import { TriangleAlert, RefreshCcw, ParkingCircle, ArrowLeft } from "lucide-react";

import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import ChronoButton from "@chrono/chrono-button.component";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const debug = useMemo(() => {
    if (process.env.NODE_ENV !== "development") return null;
    return {
      message: error?.message,
      digest: error?.digest,
      stack: error?.stack,
    };
  }, [error]);

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/12 via-background to-muted/20" />
      <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />

      <ChronoCard className="relative w-full max-w-lg overflow-hidden border-border/60 bg-card/90 shadow-xl">
        <ChronoCardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <ChronoCardTitle className="text-xl font-semibold">
                Ocurrió un error
              </ChronoCardTitle>
              <ChronoCardDescription>
                Intenta nuevamente o vuelve al módulo de parqueadero.
              </ChronoCardDescription>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-600">
              <TriangleAlert className="h-5 w-5" />
            </div>
          </div>
        </ChronoCardHeader>

        <ChronoCardContent className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ParkingCircle className="h-4 w-4" />
              <p className="text-xs">
                Si esto persiste, valida sesión/QR y reintenta.
              </p>
            </div>

            {debug?.message && (
              <p className="mt-2 text-sm font-semibold text-foreground">
                {debug.message}
              </p>
            )}

            {debug?.digest && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                Digest: <span className="font-mono">{debug.digest}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <ChronoButton
              variant="outline"
              className="w-full sm:w-auto"
              onClick={reset}
              icon={<RefreshCcw className="h-4 w-4" />}
            >
              Reintentar
            </ChronoButton>

            <ChronoButton
              asChild
              className="w-full sm:w-auto"
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              <Link href="/parking">Volver a inicio</Link>
            </ChronoButton>
          </div>
        </ChronoCardContent>
      </ChronoCard>
    </main>
  );
}
