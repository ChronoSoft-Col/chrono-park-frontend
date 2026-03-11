import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Clock9,
  LogIn,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ChronoButton from "@chrono/chrono-button.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import { ThemeSwitcher } from "@/src/shared/components/layout/theme-switcher.component";

const stats = [
  { value: "120K+", label: "Lecturas mensuales" },
  { value: "65 min", label: "Tiempo ahorrado" },
  { value: "99.9%", label: "Disponibilidad" },
];

const highlights = [
  {
    icon: QrCode,
    title: "Control de accesos multicanal",
    description: "Reconoce placas, códigos QR y credenciales móviles en un solo tablero operado por ChronoPark.",
  },
  {
    icon: BarChart3,
    title: "Inteligencia de ocupación",
    description: "Detecta picos de demanda y ajusta tarifas dinámicas con alertas predictivas.",
  },
  {
    icon: ShieldCheck,
    title: "Gobernanza y auditoría",
    description: "Cada movimiento queda registrado con trazabilidad y normas de seguridad de primer nivel.",
  },
];

const benefits = [
  {
    icon: Sparkles,
    title: "Experiencia de ingreso sin fricción",
    copy: "Guiado dinámico, paneles para el staff y notificaciones instantáneas para los conductores.",
  },
  {
    icon: Clock9,
    title: "Automatización operativa",
    copy: "Orquesta turnos, cierres de caja y reportes regulatorios desde una sola consola.",
  },
  {
    icon: BarChart3,
    title: "Visibilidad financiera",
    copy: "Dashboards vivos con comparativas históricas para tomar decisiones sin esperar al cierre.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad reforzada",
    copy: "Roles, permisos y alertas proactivas que evitan accesos indebidos en segundos.",
  },
];

const navLinks = [
  { label: "Características", href: "#features" },
  { label: "Beneficios", href: "#benefits" },
  { label: "Soporte", href: "mailto:info@chronosoft.com.co" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen w-full justify-center bg-background">
      <div className="flex w-full max-w-6xl flex-col gap-12 px-6 pb-16 pt-10 lg:px-10 lg:pb-24 lg:pt-12">
        <header className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
              <Image
                src="/img/BLACK_LOGO.png"
                alt="ChronoPark"
                width={64}
                height={64}
                className="block dark:hidden"
              />
              <Image
                src="/img/WHITE_LOGO.png"
                alt="ChronoPark"
                width={64}
                height={64}
                className="hidden dark:block"
              />
            <div className="text-left">
              <p className="text-lg font-semibold text-foreground">ChronoPark</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ChronoButton variant="ghost" className="hidden md:flex" asChild>
              <Link href="mailto:contacto@chronopark.com">Contacto</Link>
            </ChronoButton>

            <ThemeSwitcher className="hidden md:flex" />

            <ChronoButton size="sm" icon={<LogIn/>} iconPosition="left">
              <Link href="/auth/login">Iniciar sesión</Link>
            </ChronoButton>
          </div>
        </header>

        <section id="features" className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <ChronoBadge tone="soft" className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
              ChronoPark Platform
            </ChronoBadge>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
                Gestiona accesos, cobros y reportes con un flujo claro.
              </h1>
              <p className="text-base text-muted-foreground lg:text-lg">
                Una sola consola para operar estacionamientos urbanos sin fricción. Accede al panel y empieza a
                automatizar desde el primer turno.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ChronoButton size="lg" className="gap-2" asChild>
                <Link href="/auth/login">
                  Entrar ahora
                  <ArrowRight className="size-4" />
                </Link>
              </ChronoButton>
              <ChronoButton variant="outline" size="lg" asChild>
                <Link href="mailto:contacto@chronopark.com">Solicitar demo</Link>
              </ChronoButton>
            </div>
            <div className="grid gap-4 rounded-2xl border border-border/60 bg-background/80 p-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <ChronoCard className="h-full rounded-3xl border border-border/70 bg-card shadow-[0_35px_80px_-50px_rgba(0,0,0,0.6)]">
            <ChronoCardHeader>
              <ChronoCardTitle className="text-2xl">La experiencia del login, aplicada al día a día</ChronoCardTitle>
              <ChronoCardDescription>
                Interfaz limpia, bloques claros y jerarquía visual enfocada en tomar decisiones rápidas.
              </ChronoCardDescription>
            </ChronoCardHeader>
            <ChronoCardContent className="space-y-4">
              {highlights.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl border border-border/60 p-4">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
              <ChronoSeparator className="bg-border/70" />
              <div className="rounded-2xl border border-dashed border-primary/30 p-4 text-sm text-muted-foreground">
                Prototipamos mejoras continuas y las liberamos sin romper el flujo del login. Todo se siente familiar.
              </div>
            </ChronoCardContent>
          </ChronoCard>
        </section>

        <section id="benefits" className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-[0.35em] text-primary">BENEFICIOS</p>
              <h2 className="text-3xl font-semibold text-foreground">Secciones con propósito real.</h2>
              <p className="text-base text-muted-foreground lg:max-w-2xl">
                Cada bloque responde a una pregunta clave: ¿qué gana el operador, qué gana operaciones, qué gana el
                negocio? Nada de relleno.
              </p>
            </div>
            <ChronoButton variant="link" className="self-start" asChild>
              <Link href="mailto:ventas@chronopark.com">Hablar con ventas</Link>
            </ChronoButton>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-2xl border border-border/60 bg-card/70 p-5">
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-2 text-primary">
                  <Icon className="size-5" />
                </div>
                <p className="text-lg font-semibold text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{copy}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
