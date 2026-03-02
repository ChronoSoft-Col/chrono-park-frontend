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

export function PaymentMethodsChartComponent() {
  const { paymentMethods, isLoadingPaymentMethods, errorPaymentMethods } =
    useDashboardStore();

  const chartConfig: ChartConfig = {};
  if (paymentMethods) {
    paymentMethods.data.forEach((item, index) => {
      chartConfig[item.method] = {
        label: item.method,
        color: COLORS[index % COLORS.length],
      };
    });
  }

  return (
    <ChronoCard className="border border-border">
      <ChronoCardHeader>
        <ChronoCardTitle>Métodos de Pago</ChronoCardTitle>
        <ChronoCardDescription>
          {paymentMethods
            ? `${paymentMethods.data.reduce((s, d) => s + d.count, 0).toLocaleString("es-CO")} transacciones totales`
            : "Distribución por método de pago"}
        </ChronoCardDescription>
      </ChronoCardHeader>
      <ChronoCardContent>
        {isLoadingPaymentMethods && <Skeleton className="mx-auto h-[250px] w-[250px] rounded-full" />}
        {errorPaymentMethods && (
          <div className="flex h-[250px] items-center justify-center text-sm text-destructive">
            {errorPaymentMethods}
          </div>
        )}
        {!isLoadingPaymentMethods && !errorPaymentMethods && paymentMethods && (
          <>
            <ChartContainer config={chartConfig} className="mx-auto h-[250px] w-full max-w-[350px]">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  }
                />
                <Pie
                  data={paymentMethods.data}
                  dataKey="revenue"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {paymentMethods.data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey="method" />} />
              </PieChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {paymentMethods.data.map((item, index) => (
                <div key={item.method} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{item.method}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{item.count.toLocaleString("es-CO")}</span>
                    <span className="text-muted-foreground">{item.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </ChronoCardContent>
    </ChronoCard>
  );
}
