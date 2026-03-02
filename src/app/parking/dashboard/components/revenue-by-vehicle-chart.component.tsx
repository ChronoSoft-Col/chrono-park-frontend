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
import { Pie, PieChart, Cell } from "recharts";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function RevenueByVehicleChartComponent() {
  const { revenueByVehicle, isLoadingRevenueByVehicle, errorRevenueByVehicle } =
    useDashboardStore();

  const chartConfig: ChartConfig = {};
  if (revenueByVehicle) {
    revenueByVehicle.data.forEach((item, index) => {
      chartConfig[item.vehicleType] = {
        label: item.vehicleType,
        color: COLORS[index % COLORS.length],
      };
    });
  }

  return (
    <ChronoCard className="border border-border">
      <ChronoCardHeader>
        <ChronoCardTitle>Ingresos por Tipo de Vehículo</ChronoCardTitle>
        <ChronoCardDescription>
          {revenueByVehicle
            ? `Total: ${formatCurrency(revenueByVehicle.totals.revenue)} · ${revenueByVehicle.totals.count.toLocaleString("es-CO")} vehículos`
            : "Distribución de ingresos por tipo"}
        </ChronoCardDescription>
      </ChronoCardHeader>
      <ChronoCardContent>
        {isLoadingRevenueByVehicle && <Skeleton className="mx-auto h-[250px] w-[250px] rounded-full" />}
        {errorRevenueByVehicle && (
          <div className="flex h-[250px] items-center justify-center text-sm text-destructive">
            {errorRevenueByVehicle}
          </div>
        )}
        {!isLoadingRevenueByVehicle && !errorRevenueByVehicle && revenueByVehicle && (
          <ChartContainer config={chartConfig} className="mx-auto h-[250px] w-full max-w-[350px]">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="vehicleType"
                    formatter={(value, name, item) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: (item.payload?.fill || item.color || "currentColor") as string }}
                        />
                        <div className="flex flex-1 justify-between items-center gap-2">
                          <span className="text-muted-foreground">{name}</span>
                          <span className="text-foreground font-mono font-medium tabular-nums">
                            {formatCurrency(value as number)}
                          </span>
                        </div>
                      </>
                    )}
                  />
                }
              />
              <Pie
                data={revenueByVehicle.data}
                dataKey="revenue"
                nameKey="vehicleType"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {revenueByVehicle.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="vehicleType" />} />
            </PieChart>
          </ChartContainer>
        )}
      </ChronoCardContent>
    </ChronoCard>
  );
}
