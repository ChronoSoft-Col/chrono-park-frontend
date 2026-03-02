import { IDashboardDateRangeParams } from "../../entities/parking/dashboard/params/dashboard-date-range-params.entity";
import { IDashboardGroupedParams } from "../../entities/parking/dashboard/params/dashboard-grouped-params.entity";
import { IDashboardOverviewResponse } from "../../entities/parking/dashboard/response/dashboard-overview-response.entity";
import { IDashboardTrafficResponse } from "../../entities/parking/dashboard/response/dashboard-traffic-response.entity";
import { IDashboardTransactionsResponse } from "../../entities/parking/dashboard/response/dashboard-transactions-response.entity";
import { IDashboardRevenueByVehicleResponse } from "../../entities/parking/dashboard/response/dashboard-revenue-by-vehicle-response.entity";
import { IDashboardPeakHoursResponse } from "../../entities/parking/dashboard/response/dashboard-peak-hours-response.entity";
import { IDashboardStayDurationResponse } from "../../entities/parking/dashboard/response/dashboard-stay-duration-response.entity";
import { IDashboardPaymentMethodsResponse } from "../../entities/parking/dashboard/response/dashboard-payment-methods-response.entity";
import { IDashboardDailyComparisonResponse } from "../../entities/parking/dashboard/response/dashboard-daily-comparison-response.entity";

export abstract class DashboardRepository {
  abstract getOverview(): Promise<IDashboardOverviewResponse>;
  abstract getTraffic(params: IDashboardGroupedParams): Promise<IDashboardTrafficResponse>;
  abstract getTransactions(params: IDashboardGroupedParams): Promise<IDashboardTransactionsResponse>;
  abstract getRevenueByVehicle(params: IDashboardDateRangeParams): Promise<IDashboardRevenueByVehicleResponse>;
  abstract getPeakHours(params: IDashboardDateRangeParams): Promise<IDashboardPeakHoursResponse>;
  abstract getStayDuration(params: IDashboardDateRangeParams): Promise<IDashboardStayDurationResponse>;
  abstract getPaymentMethods(params: IDashboardDateRangeParams): Promise<IDashboardPaymentMethodsResponse>;
  abstract getDailyComparison(): Promise<IDashboardDailyComparisonResponse>;
}
