'use server'

import { DashboardUsecase } from "@/server/domain/index";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { IDashboardGroupedParams } from "@/server/domain/entities/parking/dashboard/params/dashboard-grouped-params.entity";
import { IDashboardDateRangeParams } from "@/server/domain/entities/parking/dashboard/params/dashboard-date-range-params.entity";
import { IDashboardOverviewData } from "@/server/domain/entities/parking/dashboard/response/dashboard-overview-response.entity";
import { IDashboardTrafficData } from "@/server/domain/entities/parking/dashboard/response/dashboard-traffic-response.entity";
import { IDashboardTransactionsData } from "@/server/domain/entities/parking/dashboard/response/dashboard-transactions-response.entity";
import { IDashboardRevenueByVehicleData } from "@/server/domain/entities/parking/dashboard/response/dashboard-revenue-by-vehicle-response.entity";
import { IDashboardPeakHoursData } from "@/server/domain/entities/parking/dashboard/response/dashboard-peak-hours-response.entity";
import { IDashboardStayDurationData } from "@/server/domain/entities/parking/dashboard/response/dashboard-stay-duration-response.entity";
import { IDashboardPaymentMethodsData } from "@/server/domain/entities/parking/dashboard/response/dashboard-payment-methods-response.entity";
import { IDashboardDailyComparisonData } from "@/server/domain/entities/parking/dashboard/response/dashboard-daily-comparison-response.entity";

export type TDashboardAllResult = {
  overview: IActionResponse<IDashboardOverviewData>;
  traffic: IActionResponse<IDashboardTrafficData>;
  transactions: IActionResponse<IDashboardTransactionsData>;
  revenueByVehicle: IActionResponse<IDashboardRevenueByVehicleData>;
  peakHours: IActionResponse<IDashboardPeakHoursData>;
  stayDuration: IActionResponse<IDashboardStayDurationData>;
  paymentMethods: IActionResponse<IDashboardPaymentMethodsData>;
  dailyComparison: IActionResponse<IDashboardDailyComparisonData>;
};

export type TDashboardDateRangeResult = {
  traffic: IActionResponse<IDashboardTrafficData>;
  transactions: IActionResponse<IDashboardTransactionsData>;
  revenueByVehicle: IActionResponse<IDashboardRevenueByVehicleData>;
  peakHours: IActionResponse<IDashboardPeakHoursData>;
  stayDuration: IActionResponse<IDashboardStayDurationData>;
  paymentMethods: IActionResponse<IDashboardPaymentMethodsData>;
};

function resolveUseCase() {
  return serverContainer.resolve<DashboardUsecase>(SERVER_TOKENS.DashboardUsecase);
}

function handleError(error: unknown, fallbackMsg: string): IActionResponse<never> {
  return {
    success: false,
    error: (error as AxiosError<IErrorResponse>).response?.data.message || fallbackMsg,
  };
}

/**
 * Fetches ALL dashboard data in a single server action call.
 * All 8 endpoints run in parallel via Promise.all on the server side,
 * avoiding Next.js client-side server action serialization.
 */
export async function fetchAllDashboardAction(
  params: IDashboardGroupedParams,
): Promise<TDashboardAllResult> {
  try {
    const useCase = resolveUseCase();
    const dateRangeParams: IDashboardDateRangeParams = {
      startDate: params.startDate,
      endDate: params.endDate,
    };

    const [
      overviewRes,
      trafficRes,
      transactionsRes,
      revenueByVehicleRes,
      peakHoursRes,
      stayDurationRes,
      paymentMethodsRes,
      dailyComparisonRes,
    ] = await Promise.all([
      useCase.getOverview().then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en resumen")),
      useCase.getTraffic(params).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en tráfico")),
      useCase.getTransactions(params).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en transacciones")),
      useCase.getRevenueByVehicle(dateRangeParams).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en ingresos por vehículo")),
      useCase.getPeakHours(dateRangeParams).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en horas pico")),
      useCase.getStayDuration(dateRangeParams).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en estancia")),
      useCase.getPaymentMethods(dateRangeParams).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en métodos de pago")),
      useCase.getDailyComparison().then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en comparación")),
    ]);

    return {
      overview: overviewRes,
      traffic: trafficRes,
      transactions: transactionsRes,
      revenueByVehicle: revenueByVehicleRes,
      peakHours: peakHoursRes,
      stayDuration: stayDurationRes,
      paymentMethods: paymentMethodsRes,
      dailyComparison: dailyComparisonRes,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    const fallback = handleError(error, "Error general del dashboard");
    return {
      overview: fallback,
      traffic: fallback,
      transactions: fallback,
      revenueByVehicle: fallback,
      peakHours: fallback,
      stayDuration: fallback,
      paymentMethods: fallback,
      dailyComparison: fallback,
    };
  }
}

/**
 * Fetches only the date-range-dependent dashboard data in parallel.
 * Used when the user changes date filters (overview & daily comparison are independent).
 */
export async function fetchDateRangeDashboardAction(
  params: IDashboardGroupedParams,
): Promise<TDashboardDateRangeResult> {
  try {
    const useCase = resolveUseCase();
    const dateRangeParams: IDashboardDateRangeParams = {
      startDate: params.startDate,
      endDate: params.endDate,
    };

    const [
      trafficRes,
      transactionsRes,
      revenueByVehicleRes,
      peakHoursRes,
      stayDurationRes,
      paymentMethodsRes,
    ] = await Promise.all([
      useCase.getTraffic(params).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en tráfico")),
      useCase.getTransactions(params).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en transacciones")),
      useCase.getRevenueByVehicle(dateRangeParams).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en ingresos por vehículo")),
      useCase.getPeakHours(dateRangeParams).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en horas pico")),
      useCase.getStayDuration(dateRangeParams).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en estancia")),
      useCase.getPaymentMethods(dateRangeParams).then(r => ({ data: r.data, success: true as const })).catch(e => handleError(e, "Error en métodos de pago")),
    ]);

    return {
      traffic: trafficRes,
      transactions: transactionsRes,
      revenueByVehicle: revenueByVehicleRes,
      peakHours: peakHoursRes,
      stayDuration: stayDurationRes,
      paymentMethods: paymentMethodsRes,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    const fallback = handleError(error, "Error general del dashboard");
    return {
      traffic: fallback,
      transactions: fallback,
      revenueByVehicle: fallback,
      peakHours: fallback,
      stayDuration: fallback,
      paymentMethods: fallback,
    };
  }
}
