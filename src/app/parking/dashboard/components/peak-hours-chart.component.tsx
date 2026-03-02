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
  type ChartConfig,
} from "@/src/shared/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
            <BarChart data={peakHours.hourlyAverage} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <Bar
                dataKey="avgEntries"
                fill="var(--color-avgEntries)"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
              <Bar
                dataKey="avgOccupancy"
                fill="var(--color-avgOccupancy)"
                radius={[4, 4, 0, 0]}
                barSize={12}
              />
            </BarChart>
          </ChartContainer>
        )}
      </ChronoCardContent>
    </ChronoCard>
  );
}
