"use client";

import { useDashboardStore } from "@/src/shared/stores/dashboard.store";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import {
  Car,
  DoorOpen,
  DoorClosed,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ParkingCircle,
  Minus,
} from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number | null) {
  if (value === null) return "N/A";
  return `${value.toFixed(1)}%`;
}

function TrendBadge({ value, label }: { value: number; label: string }) {
  const isPositive = value > 0;
  const isZero = value === 0;
  const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown;
  const color = isZero
    ? "text-muted-foreground"
    : isPositive
      ? "text-emerald-600"
      : "text-red-500";

  return (
    <div className="flex items-center gap-1">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className={`text-xs font-medium ${color}`}>
        {isPositive ? "+" : ""}
        {value.toFixed(1)}% {label}
      </span>
    </div>
  );
}

export function OverviewCardsComponent() {
  const { overview, isLoadingOverview, errorOverview } = useDashboardStore();

  if (isLoadingOverview) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ChronoCard key={i}>
            <ChronoCardHeader>
              <Skeleton className="h-4 w-24" />
            </ChronoCardHeader>
            <ChronoCardContent>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="mt-2 h-3 w-32" />
            </ChronoCardContent>
          </ChronoCard>
        ))}
      </div>
    );
  }

  if (errorOverview) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        {errorOverview}
      </div>
    );
  }

  if (!overview) return null;

  const { occupancy, todayStats, comparison } = overview;

  const cards = [
    {
      title: "Ocupación",
      value: occupancy.percentage !== null ? `${occupancy.percentage.toFixed(0)}%` : "N/A",
      description:
        occupancy.total !== null
          ? `${occupancy.occupied} de ${occupancy.total} espacios`
          : `${occupancy.occupied} vehículos activos`,
      icon: ParkingCircle,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Entradas hoy",
      value: todayStats.entries.toLocaleString("es-CO"),
      description: <TrendBadge value={comparison.entriesChange} label="vs ayer" />,
      icon: DoorOpen,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
    },
    {
      title: "Salidas hoy",
      value: todayStats.exits.toLocaleString("es-CO"),
      description: `${todayStats.activeVehicles} vehículos activos`,
      icon: DoorClosed,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
    {
      title: "Ingresos hoy",
      value: formatCurrency(todayStats.revenue),
      description: <TrendBadge value={comparison.revenueChange} label="vs ayer" />,
      icon: DollarSign,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-100",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <ChronoCard key={card.title} className="border border-border">
          <ChronoCardHeader className="flex flex-row items-center justify-between pb-2">
            <ChronoCardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </ChronoCardTitle>
            <div className={`rounded-lg p-2 ${card.iconBg}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </ChronoCardHeader>
          <ChronoCardContent>
            <p className="text-2xl font-bold">{card.value}</p>
            <div className="mt-1 text-xs text-muted-foreground">{card.description}</div>
          </ChronoCardContent>
        </ChronoCard>
      ))}
    </div>
  );
}
