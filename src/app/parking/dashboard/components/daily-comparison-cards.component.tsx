"use client";

import { useDashboardStore } from "@/src/shared/stores/dashboard.store";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import { TrendingUp, TrendingDown, Minus, DoorOpen, DoorClosed, DollarSign } from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { IDashboardDayStats } from "@/server/domain/entities/parking/dashboard/response/dashboard-daily-comparison-response.entity";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function ComparisonRow({ label, current, previous }: { label: string; current: number; previous: number }) {
  const change = percentChange(current, previous);
  const isPositive = change > 0;
  const isZero = change === 0;
  const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown;
  const color = isZero ? "text-muted-foreground" : isPositive ? "text-emerald-600" : "text-red-500";

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{current.toLocaleString("es-CO")}</span>
        <div className={`flex items-center gap-0.5 ${color}`}>
          <Icon className="h-3 w-3" />
          <span className="text-xs font-medium">{isPositive ? "+" : ""}{change.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

function DayCard({ title, todayStats, periodStats }: { title: string; todayStats: IDashboardDayStats; periodStats: IDashboardDayStats }) {
  return (
    <ChronoCard className="border border-border" size="sm">
      <ChronoCardHeader>
        <ChronoCardTitle className="text-sm">{title}</ChronoCardTitle>
      </ChronoCardHeader>
      <ChronoCardContent className="space-y-1">
        <ComparisonRow
          label="Entradas"
          current={todayStats.entries}
          previous={periodStats.entries}
        />
        <ComparisonRow
          label="Salidas"
          current={todayStats.exits}
          previous={periodStats.exits}
        />
        <ComparisonRow
          label="Ingresos"
          current={todayStats.revenue}
          previous={periodStats.revenue}
        />
      </ChronoCardContent>
    </ChronoCard>
  );
}

export function DailyComparisonCardsComponent() {
  const { dailyComparison, isLoadingDailyComparison, errorDailyComparison } =
    useDashboardStore();

  if (isLoadingDailyComparison) {
    return (
      <ChronoCard className="border border-border">
        <ChronoCardHeader>
          <ChronoCardTitle>Comparativa Diaria</ChronoCardTitle>
        </ChronoCardHeader>
        <ChronoCardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px]" />
            ))}
          </div>
        </ChronoCardContent>
      </ChronoCard>
    );
  }

  if (errorDailyComparison) {
    return (
      <ChronoCard className="border border-border">
        <ChronoCardHeader>
          <ChronoCardTitle>Comparativa Diaria</ChronoCardTitle>
        </ChronoCardHeader>
        <ChronoCardContent>
          <div className="flex h-[100px] items-center justify-center text-sm text-destructive">
            {errorDailyComparison}
          </div>
        </ChronoCardContent>
      </ChronoCard>
    );
  }

  if (!dailyComparison) return null;

  const { today, yesterday, lastWeekSameDay, lastMonthSameDay } = dailyComparison;

  return (
    <ChronoCard className="border border-border">
      <ChronoCardHeader>
        <ChronoCardTitle>Comparativa Diaria</ChronoCardTitle>
      </ChronoCardHeader>
      <ChronoCardContent>
        <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg border border-border/50 bg-muted/20 p-4">
          <div className="flex flex-col items-center gap-1">
            <DoorOpen className="h-4 w-4 text-emerald-600" />
            <span className="text-lg font-bold">{today.entries.toLocaleString("es-CO")}</span>
            <span className="text-xs text-muted-foreground">Entradas hoy</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <DoorClosed className="h-4 w-4 text-amber-600" />
            <span className="text-lg font-bold">{today.exits.toLocaleString("es-CO")}</span>
            <span className="text-xs text-muted-foreground">Salidas hoy</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <DollarSign className="h-4 w-4 text-violet-600" />
            <span className="text-lg font-bold">{formatCurrency(today.revenue)}</span>
            <span className="text-xs text-muted-foreground">Ingresos hoy</span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <DayCard title="vs Ayer" todayStats={today} periodStats={yesterday} />
          <DayCard title="vs Semana pasada" todayStats={today} periodStats={lastWeekSameDay} />
          <DayCard title="vs Mes pasado" todayStats={today} periodStats={lastMonthSameDay} />
        </div>
      </ChronoCardContent>
    </ChronoCard>
  );
}
