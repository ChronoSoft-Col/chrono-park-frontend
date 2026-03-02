"use client";

import { useDashboardStore } from "@/src/shared/stores/dashboard.store";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardHeader,
  ChronoCardTitle,
  ChronoCardDescription,
} from "@chrono/chrono-card.component";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/src/shared/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

const chartConfig = {
  entries: {
    label: "Entradas",
    color: "var(--chart-1)",
  },
  exits: {
    label: "Salidas",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatDateLabel(dateStr: string) {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return new Intl.DateTimeFormat("es-CO", { day: "2-digit", month: "short" }).format(date);
  } catch {
    return dateStr;
  }
}

export function TrafficChartComponent() {
  const { traffic, isLoadingTraffic, errorTraffic } = useDashboardStore();

  return (
    <ChronoCard className="border border-border">
      <ChronoCardHeader>
        <ChronoCardTitle>Tráfico de Entradas y Salidas</ChronoCardTitle>
        <ChronoCardDescription>
          {traffic
            ? `${traffic.totals.entries.toLocaleString("es-CO")} entradas · ${traffic.totals.exits.toLocaleString("es-CO")} salidas`
            : "Evolución de entradas y salidas en el período"}
        </ChronoCardDescription>
      </ChronoCardHeader>
      <ChronoCardContent>
        {isLoadingTraffic && <Skeleton className="h-[300px] w-full" />}
        {errorTraffic && (
          <div className="flex h-[300px] items-center justify-center text-sm text-destructive">
            {errorTraffic}
          </div>
        )}
        {!isLoadingTraffic && !errorTraffic && traffic && (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={traffic.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillEntries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-entries)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-entries)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillExits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-exits)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-exits)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDateLabel}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => formatDateLabel(label as string)}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="entries"
                type="monotone"
                fill="url(#fillEntries)"
                stroke="var(--color-entries)"
                strokeWidth={2}
              />
              <Area
                dataKey="exits"
                type="monotone"
                fill="url(#fillExits)"
                stroke="var(--color-exits)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </ChronoCardContent>
    </ChronoCard>
  );
}
