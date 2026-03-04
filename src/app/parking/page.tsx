"use client";

import type { ComponentType } from "react";
import { useRouter } from "next/navigation";

import { useClientSession } from "@/src/lib/session-client";
import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardFooter,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ArrowRight, CalendarClock, ClipboardCheck, CreditCard, LoaderCircle } from "lucide-react";

export default function ParkingPage() {
  const router = useRouter();
  const { data: session, isLoading, refresh } = useClientSession();
  const userName = session?.user?.name || session?.user?.email || "usuario";
  const userEmail = session?.user?.email || "Sin correo registrado";
  const userRole = session?.role?.name;
  const userRoleLabel = userRole || "Sin rol asignado";
  const sessionIssuedAt = session?.metadata?.issuedAt;
  const sessionExpiresAt = session?.metadata?.expiresAt;

  const formatTimestamp = (value?: number) => {
    if (!value) return "—";
    try {
      return new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value));
    } catch {
      return "—";
    }
  };

  const modules = [
    {
      key: "manual-control",
      title: "Control manual",
      description: "Registra ingresos respaldados y sincronizados en tiempo real.",
      href: "/parking/control-manual",
      icon: ClipboardCheck,
      badge: "Operativo",
    },
    {
      key: "payments",
      title: "Pagos",
      description: "Accede al módulo de cobro para agilizar la facturación y cierre de sesiones.",
      href: "/parking/cobro",
      icon: CreditCard,
      badge: "Cobro",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center py-20 text-sm text-muted-foreground">
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        Verificando sesión…
      </div>
    );
  }

  if (!session) {
    return (
      <section className="space-y-4">
        <p>Sesión no disponible.</p>
        <ChronoButton type="button" variant="link" size="sm" onClick={() => refresh(true)}>
          Reintentar
        </ChronoButton>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/95 p-8">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-linear-to-l from-primary/20 via-primary/5 to-transparent sm:block" />
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <ChronoBadge variant="outline" className="text-xs font-medium">Módulo operativo</ChronoBadge>
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Hola {userName}, este es tu centro de control de ChronoPark
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground">
              Despliega acciones rápidas, accede a los módulos disponibles y monitorea la salud de tu sesión.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryTile label="Rol" value={userRoleLabel} />
            <SummaryTile label="Correo" value={userEmail} />
            <SummaryTile
              label="Sesión creada"
              value={formatTimestamp(sessionIssuedAt)}
              icon={CalendarClock}
            />
            <SummaryTile
              label="Expira"
              value={formatTimestamp(sessionExpiresAt)}
              icon={CalendarClock}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">Módulos y accesos</h2>
            <p className="text-sm text-muted-foreground">
              Selecciona un módulo para continuar con tu flujo de trabajo.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(({ key, title, description, href, icon: Icon, badge }) => (
            <ChronoCard key={key} className="border border-border bg-card/90">
              <ChronoCardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                {badge && <ChronoBadge variant="secondary">{badge}</ChronoBadge>}
              </ChronoCardHeader>
              <ChronoCardContent className="space-y-2">
                <ChronoCardTitle className="text-lg font-semibold">{title}</ChronoCardTitle>
                <ChronoCardDescription>{description}</ChronoCardDescription>
              </ChronoCardContent>
              <ChronoCardFooter>
                <ChronoButton variant="outline" size="sm" className="ml-auto" onClick={() => router.push(href)}>
                  Abrir módulo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ChronoButton>
              </ChronoCardFooter>
            </ChronoCard>
          ))}
        </div>
      </div>

    </section>
  );
}

type SummaryTileProps = {
  label: string;
  value: string;
  icon?: ComponentType<{ className?: string }>;
};

function SummaryTile({ label, value, icon: Icon }: SummaryTileProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/10 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-primary" />}
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
