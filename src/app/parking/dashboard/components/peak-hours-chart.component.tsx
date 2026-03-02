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
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

const chartConfig = {
  avgEntries: {
    label: "Entradas Prom.",
    color: "var(--chart-1)",
  },
  avgOccupancy: {
    label: "Ocupación Prom.",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

function formatHour(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function PeakHoursChartComponent() {
  const { peakHours, isLoadingPeakHours, errorPeakHours } = useDashboardStore();

  return (
    <ChronoCard className="border border-border">
      <ChronoCardHeader>
        <ChronoCardTitle>Horas Pico</ChronoCardTitle>
        <ChronoCardDescription>
          {peakHours
            ? `Hora pico: ${formatHour(peakHours.peakHour.hour)} · Ocupación prom: ${peakHours.peakHour.avgOccupancy}`
            : "Promedio de entradas y ocupación por hora del día"}
        </ChronoCardDescription>
      </ChronoCardHeader>
      <ChronoCardContent>
        {isLoadingPeakHours && <Skeleton className="h-[300px] w-full" />}
        {errorPeakHours && (
          <div className="flex h-[300px] items-center justify-center text-sm text-destructive">
            {errorPeakHours}
          </div>
        )}
        {!isLoadingPeakHours && !errorPeakHours && peakHours && (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={peakHours.hourlyAverage} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillAvgEntries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-avgEntries)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-avgEntries)" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillAvgOccupancy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-avgOccupancy)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-avgOccupancy)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatHour}
              />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Hora: ${formatHour(label as number)}`}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="avgEntries"
                type="monotone"
                fill="url(#fillAvgEntries)"
                stroke="var(--color-avgEntries)"
                strokeWidth={2}
              />
              <Area
                dataKey="avgOccupancy"
                type="monotone"
                fill="url(#fillAvgOccupancy)"
                stroke="var(--color-avgOccupancy)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </ChronoCardContent>
    </ChronoCard>
  );
}
