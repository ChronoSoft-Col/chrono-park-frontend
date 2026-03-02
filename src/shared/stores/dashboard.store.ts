"use client"

import { create } from "zustand";
import {
  fetchAllDashboardAction,
  fetchDateRangeDashboardAction,
} from "@/src/app/parking/dashboard/actions/fetch-all-dashboard.action";
import { IDashboardOverviewData } from "@/server/domain/entities/parking/dashboard/response/dashboard-overview-response.entity";
import { IDashboardTrafficData } from "@/server/domain/entities/parking/dashboard/response/dashboard-traffic-response.entity";
import { IDashboardTransactionsData } from "@/server/domain/entities/parking/dashboard/response/dashboard-transactions-response.entity";
import { IDashboardRevenueByVehicleData } from "@/server/domain/entities/parking/dashboard/response/dashboard-revenue-by-vehicle-response.entity";
import { IDashboardPeakHoursData } from "@/server/domain/entities/parking/dashboard/response/dashboard-peak-hours-response.entity";
import { IDashboardStayDurationData } from "@/server/domain/entities/parking/dashboard/response/dashboard-stay-duration-response.entity";
import { IDashboardPaymentMethodsData } from "@/server/domain/entities/parking/dashboard/response/dashboard-payment-methods-response.entity";
import { IDashboardDailyComparisonData } from "@/server/domain/entities/parking/dashboard/response/dashboard-daily-comparison-response.entity";
import { TDashboardGroupBy } from "@/server/domain/entities/parking/dashboard/params/dashboard-grouped-params.entity";

type TDashboardState = {
  // Filters
  startDate: string;
  endDate: string;
  groupBy: TDashboardGroupBy;

  // Data
  overview: IDashboardOverviewData | null;
  traffic: IDashboardTrafficData | null;
  transactions: IDashboardTransactionsData | null;
  revenueByVehicle: IDashboardRevenueByVehicleData | null;
  peakHours: IDashboardPeakHoursData | null;
  stayDuration: IDashboardStayDurationData | null;
  paymentMethods: IDashboardPaymentMethodsData | null;
  dailyComparison: IDashboardDailyComparisonData | null;

  // Loading states
  isLoadingOverview: boolean;
  isLoadingTraffic: boolean;
  isLoadingTransactions: boolean;
  isLoadingRevenueByVehicle: boolean;
  isLoadingPeakHours: boolean;
  isLoadingStayDuration: boolean;
  isLoadingPaymentMethods: boolean;
  isLoadingDailyComparison: boolean;

  // Error states
  errorOverview: string | null;
  errorTraffic: string | null;
  errorTransactions: string | null;
  errorRevenueByVehicle: string | null;
  errorPeakHours: string | null;
  errorStayDuration: string | null;
  errorPaymentMethods: string | null;
  errorDailyComparison: string | null;
};

type TDashboardActions = {
  setDateRange: (startDate: string, endDate: string) => void;
  setGroupBy: (groupBy: TDashboardGroupBy) => void;
  fetchAll: () => Promise<void>;
  fetchDateRangeData: () => Promise<void>;
};

type TDashboardStore = TDashboardState & TDashboardActions;

function getDefaultDateRange() {
  const now = new Date();
  const endDate = now.toISOString().split("T")[0];
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  return { startDate, endDate };
}

const defaultRange = getDefaultDateRange();

export const useDashboardStore = create<TDashboardStore>()((set, get) => ({
  // Filters
  startDate: defaultRange.startDate,
  endDate: defaultRange.endDate,
  groupBy: "day" as TDashboardGroupBy,

  // Data
  overview: null,
  traffic: null,
  transactions: null,
  revenueByVehicle: null,
  peakHours: null,
  stayDuration: null,
  paymentMethods: null,
  dailyComparison: null,

  // Loading
  isLoadingOverview: false,
  isLoadingTraffic: false,
  isLoadingTransactions: false,
  isLoadingRevenueByVehicle: false,
  isLoadingPeakHours: false,
  isLoadingStayDuration: false,
  isLoadingPaymentMethods: false,
  isLoadingDailyComparison: false,

  // Errors
  errorOverview: null,
  errorTraffic: null,
  errorTransactions: null,
  errorRevenueByVehicle: null,
  errorPeakHours: null,
  errorStayDuration: null,
  errorPaymentMethods: null,
  errorDailyComparison: null,

  setDateRange: (startDate: string, endDate: string) => {
    set({ startDate, endDate });
  },

  setGroupBy: (groupBy: TDashboardGroupBy) => {
    set({ groupBy });
  },

  fetchAll: async () => {
    const { startDate, endDate, groupBy } = get();

    // Set all loading states at once
    set({
      isLoadingOverview: true, errorOverview: null,
      isLoadingTraffic: true, errorTraffic: null,
      isLoadingTransactions: true, errorTransactions: null,
      isLoadingRevenueByVehicle: true, errorRevenueByVehicle: null,
      isLoadingPeakHours: true, errorPeakHours: null,
      isLoadingStayDuration: true, errorStayDuration: null,
      isLoadingPaymentMethods: true, errorPaymentMethods: null,
      isLoadingDailyComparison: true, errorDailyComparison: null,
    });

    try {
      // Single server action call — all 8 fetches run in parallel on the server
      const result = await fetchAllDashboardAction({ startDate, endDate, groupBy });

      set({
        overview: result.overview.success ? result.overview.data ?? null : null,
        errorOverview: result.overview.success ? null : result.overview.error ?? null,
        traffic: result.traffic.success ? result.traffic.data ?? null : null,
        errorTraffic: result.traffic.success ? null : result.traffic.error ?? null,
        transactions: result.transactions.success ? result.transactions.data ?? null : null,
        errorTransactions: result.transactions.success ? null : result.transactions.error ?? null,
        revenueByVehicle: result.revenueByVehicle.success ? result.revenueByVehicle.data ?? null : null,
        errorRevenueByVehicle: result.revenueByVehicle.success ? null : result.revenueByVehicle.error ?? null,
        peakHours: result.peakHours.success ? result.peakHours.data ?? null : null,
        errorPeakHours: result.peakHours.success ? null : result.peakHours.error ?? null,
        stayDuration: result.stayDuration.success ? result.stayDuration.data ?? null : null,
        errorStayDuration: result.stayDuration.success ? null : result.stayDuration.error ?? null,
        paymentMethods: result.paymentMethods.success ? result.paymentMethods.data ?? null : null,
        errorPaymentMethods: result.paymentMethods.success ? null : result.paymentMethods.error ?? null,
        dailyComparison: result.dailyComparison.success ? result.dailyComparison.data ?? null : null,
        errorDailyComparison: result.dailyComparison.success ? null : result.dailyComparison.error ?? null,
      });
    } catch {
      const connErr = "Error de conexión";
      set({
        errorOverview: connErr, errorTraffic: connErr, errorTransactions: connErr,
        errorRevenueByVehicle: connErr, errorPeakHours: connErr, errorStayDuration: connErr,
        errorPaymentMethods: connErr, errorDailyComparison: connErr,
      });
    } finally {
      set({
        isLoadingOverview: false, isLoadingTraffic: false, isLoadingTransactions: false,
        isLoadingRevenueByVehicle: false, isLoadingPeakHours: false, isLoadingStayDuration: false,
        isLoadingPaymentMethods: false, isLoadingDailyComparison: false,
      });
    }
  },

  fetchDateRangeData: async () => {
    const { startDate, endDate, groupBy } = get();

    set({
      isLoadingTraffic: true, errorTraffic: null,
      isLoadingTransactions: true, errorTransactions: null,
      isLoadingRevenueByVehicle: true, errorRevenueByVehicle: null,
      isLoadingPeakHours: true, errorPeakHours: null,
      isLoadingStayDuration: true, errorStayDuration: null,
      isLoadingPaymentMethods: true, errorPaymentMethods: null,
    });

    try {
      // Single server action call — 6 fetches run in parallel on the server
      const result = await fetchDateRangeDashboardAction({ startDate, endDate, groupBy });

      set({
        traffic: result.traffic.success ? result.traffic.data ?? null : null,
        errorTraffic: result.traffic.success ? null : result.traffic.error ?? null,
        transactions: result.transactions.success ? result.transactions.data ?? null : null,
        errorTransactions: result.transactions.success ? null : result.transactions.error ?? null,
        revenueByVehicle: result.revenueByVehicle.success ? result.revenueByVehicle.data ?? null : null,
        errorRevenueByVehicle: result.revenueByVehicle.success ? null : result.revenueByVehicle.error ?? null,
        peakHours: result.peakHours.success ? result.peakHours.data ?? null : null,
        errorPeakHours: result.peakHours.success ? null : result.peakHours.error ?? null,
        stayDuration: result.stayDuration.success ? result.stayDuration.data ?? null : null,
        errorStayDuration: result.stayDuration.success ? null : result.stayDuration.error ?? null,
        paymentMethods: result.paymentMethods.success ? result.paymentMethods.data ?? null : null,
        errorPaymentMethods: result.paymentMethods.success ? null : result.paymentMethods.error ?? null,
      });
    } catch {
      const connErr = "Error de conexión";
      set({
        errorTraffic: connErr, errorTransactions: connErr, errorRevenueByVehicle: connErr,
        errorPeakHours: connErr, errorStayDuration: connErr, errorPaymentMethods: connErr,
      });
    } finally {
      set({
        isLoadingTraffic: false, isLoadingTransactions: false, isLoadingRevenueByVehicle: false,
        isLoadingPeakHours: false, isLoadingStayDuration: false, isLoadingPaymentMethods: false,
      });
    }
  },
}));
