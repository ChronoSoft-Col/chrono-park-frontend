"use client";

import { useEffect } from "react";
import { useDashboardStore } from "@/src/shared/stores/dashboard.store";
import { SetupHeaderFilters } from "@/src/shared/components/layout/setup-header-filters.component";
import { ChronoViewLayout } from "@chrono/chrono-view-layout.component";
import { DashboardDateFilterComponent } from "./components/dashboard-date-filter.component";
import { OverviewCardsComponent } from "./components/overview-cards.component";
import { TrafficChartComponent } from "./components/traffic-chart.component";
import { TransactionsChartComponent } from "./components/transactions-chart.component";
import { RevenueByVehicleChartComponent } from "./components/revenue-by-vehicle-chart.component";
import { PeakHoursChartComponent } from "./components/peak-hours-chart.component";
import { StayDurationChartComponent } from "./components/stay-duration-chart.component";
import { PaymentMethodsChartComponent } from "./components/payment-methods-chart.component";
import { DailyComparisonCardsComponent } from "./components/daily-comparison-cards.component";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { fetchAll } = useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <ChronoViewLayout
      title={
        <span className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          Dashboard
        </span>
      }
      description="Resumen operativo y analíticas del estacionamiento"
      filters={<DashboardDateFilterComponent />}
      contentClassName="space-y-6 p-6"
    >
      <SetupHeaderFilters showDatePicker={false} showDateRangePicker={false} showSearch={false} />

      {/* KPI Cards */}
      <OverviewCardsComponent />

      {/* Charts Row 1: Traffic + Transactions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TrafficChartComponent />
        <TransactionsChartComponent />
      </div>

      {/* Charts Row 2: Revenue by Vehicle + Payment Methods */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueByVehicleChartComponent />
        <PaymentMethodsChartComponent />
      </div>

      {/* Charts Row 3: Peak Hours + Stay Duration */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PeakHoursChartComponent />
        <StayDurationChartComponent />
      </div>

      {/* Daily Comparison */}
      <DailyComparisonCardsComponent />
    </ChronoViewLayout>
  );
}
