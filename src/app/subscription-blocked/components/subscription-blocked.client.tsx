"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeAlert, LogOut, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import ChronoButton from "@chrono/chrono-button.component";
import { signOut } from "@/lib/session-client";
import { verifyLicense } from "../actions/verify-license";

type Props = { reason?: string };

export default function SubscriptionBlockedClient({ reason }: Props) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const onRetry = async () => {
    setRetrying(true);
    try {
      const result = await verifyLicense();
      if (result.ok) {
        toast.success("Licencia activa — redirigiendo");
        router.replace("/parking");
        return;
      }
      toast.warning("La licencia sigue inactiva. Intenta más tarde.");
    } catch {
      toast.error("No se pudo verificar la licencia. Revisa tu conexión.");
    } finally {
      setRetrying(false);
    }
  };

  const onLogout = async () => {
    setLoggingOut(true);
    await signOut();
    window.location.assign("/auth/login");
  };

  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/12 via-background to-muted/20" />
      <div className="pointer-events-none absolute left-1/2 top-[-120px] h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />

      <ChronoCard className="relative w-full max-w-lg overflow-hidden border-border/60 bg-card/90 shadow-xl">
        <ChronoCardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <ChronoCardTitle className="text-xl font-semibold">
                Suscripción inactiva
              </ChronoCardTitle>
              <ChronoCardDescription>
                {reason ?? "Tu licencia no está activa en este momento."}
              </ChronoCardDescription>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-600">
              <BadgeAlert className="h-5 w-5" />
            </div>
          </div>
        </ChronoCardHeader>

        <ChronoCardContent className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-background/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Contacta a tu administrador para renovar la suscripción. Cuando
              esté activa podrás reintentar desde aquí sin perder la sesión.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <ChronoButton
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onLogout}
              loading={loggingOut}
              disabled={retrying}
              icon={<LogOut className="h-4 w-4" />}
            >
              Cerrar sesión
            </ChronoButton>

            <ChronoButton
              className="w-full sm:w-auto"
              onClick={onRetry}
              loading={retrying}
              disabled={loggingOut}
              icon={<RefreshCcw className="h-4 w-4" />}
            >
              Reintentar
            </ChronoButton>
          </div>
        </ChronoCardContent>
      </ChronoCard>
    </main>
  );
}
