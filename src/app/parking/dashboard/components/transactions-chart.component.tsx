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
import { Bar, BarChart, CartesianGrid, Line, ComposedChart, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/src/shared/components/ui/skeleton";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "var(--chart-1)",
  },
  count: {
    label: "Transacciones",
    color: "var(--chart-3)",
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

export function TransactionsChartComponent() {
  const { transactions, isLoadingTransactions, errorTransactions } = useDashboardStore();

  return (
    <ChronoCard className="border border-border">
      <ChronoCardHeader>
        <ChronoCardTitle>Transacciones e Ingresos</ChronoCardTitle>
        <ChronoCardDescription>
          {transactions
            ? `${transactions.totals.count.toLocaleString("es-CO")} transacciones · Ticket promedio: ${formatCurrency(transactions.averageTicket)}`
            : "Resumen de transacciones y recaudo"}
        </ChronoCardDescription>
      </ChronoCardHeader>
      <ChronoCardContent>
        {isLoadingTransactions && <Skeleton className="h-[300px] w-full" />}
        {errorTransactions && (
          <div className="flex h-[300px] items-center justify-center text-sm text-destructive">
            {errorTransactions}
          </div>
        )}
        {!isLoadingTransactions && !errorTransactions && transactions && (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ComposedChart data={transactions.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatDateLabel}
              />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === "revenue") return formatCurrency(value as number);
                      return (value as number).toLocaleString("es-CO");
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar yAxisId="left" dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} barSize={20} />
              <Line
                yAxisId="right"
                dataKey="revenue"
                type="monotone"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </ChronoCardContent>
    </ChronoCard>
  );
}
