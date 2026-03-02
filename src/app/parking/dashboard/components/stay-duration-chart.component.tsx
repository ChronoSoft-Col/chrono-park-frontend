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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

const chartConfig = {
  count: {
    label: "Vehículos",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function StayDurationChartComponent() {
  const { stayDuration, isLoadingStayDuration, errorStayDuration } = useDashboardStore();

  return (
    <ChronoCard className="border border-border">
      <ChronoCardHeader>
        <ChronoCardTitle>Tiempo de Estancia</ChronoCardTitle>
        <ChronoCardDescription>
          {stayDuration
            ? `Promedio: ${formatMinutes(stayDuration.averageMinutes)}`
            : "Distribución del tiempo de permanencia"}
        </ChronoCardDescription>
      </ChronoCardHeader>
      <ChronoCardContent>
        {isLoadingStayDuration && <Skeleton className="h-[300px] w-full" />}
        {errorStayDuration && (
          <div className="flex h-[300px] items-center justify-center text-sm text-destructive">
            {errorStayDuration}
          </div>
        )}
        {!isLoadingStayDuration && !errorStayDuration && stayDuration && (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={stayDuration.distribution}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: (item.color || item.payload?.fill || "currentColor") as string }}
                        />
                        <div className="flex flex-1 justify-between items-center gap-2">
                          <span className="text-muted-foreground">
                            {chartConfig[name as keyof typeof chartConfig]?.label || name}
                          </span>
                          <span className="text-foreground font-mono font-medium tabular-nums">
                            {`${(value as number).toLocaleString("es-CO")} (${item.payload?.percentage?.toFixed(1)}%)`}
                          </span>
                        </div>
                      </>
                    )}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ChartContainer>
        )}
      </ChronoCardContent>
    </ChronoCard>
  );
}
