import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import { DashboardRepository } from "@/server/domain/index";
import { IDashboardDateRangeParams } from "@/server/domain/entities/parking/dashboard/params/dashboard-date-range-params.entity";
import { IDashboardGroupedParams } from "@/server/domain/entities/parking/dashboard/params/dashboard-grouped-params.entity";
import { IDashboardOverviewResponse } from "@/server/domain/entities/parking/dashboard/response/dashboard-overview-response.entity";
import { IDashboardTrafficResponse } from "@/server/domain/entities/parking/dashboard/response/dashboard-traffic-response.entity";
import { IDashboardTransactionsResponse } from "@/server/domain/entities/parking/dashboard/response/dashboard-transactions-response.entity";
import { IDashboardRevenueByVehicleResponse } from "@/server/domain/entities/parking/dashboard/response/dashboard-revenue-by-vehicle-response.entity";
import { IDashboardPeakHoursResponse } from "@/server/domain/entities/parking/dashboard/response/dashboard-peak-hours-response.entity";
import { IDashboardStayDurationResponse } from "@/server/domain/entities/parking/dashboard/response/dashboard-stay-duration-response.entity";
import { IDashboardPaymentMethodsResponse } from "@/server/domain/entities/parking/dashboard/response/dashboard-payment-methods-response.entity";
import { IDashboardDailyComparisonResponse } from "@/server/domain/entities/parking/dashboard/response/dashboard-daily-comparison-response.entity";

@injectable()
export class DashboardDatasourceService extends AxiosServerInstance implements DashboardRepository {

  async getOverview(): Promise<IDashboardOverviewResponse> {
    return this.api
      .get<IDashboardOverviewResponse>("/dashboard/overview")
      .then((r) => r.data);
  }

  async getTraffic(params: IDashboardGroupedParams): Promise<IDashboardTrafficResponse> {
    return this.api
      .get<IDashboardTrafficResponse>("/dashboard/traffic", { params })
      .then((r) => r.data);
  }

  async getTransactions(params: IDashboardGroupedParams): Promise<IDashboardTransactionsResponse> {
    return this.api
      .get<IDashboardTransactionsResponse>("/dashboard/transactions", { params })
      .then((r) => r.data);
  }

  async getRevenueByVehicle(params: IDashboardDateRangeParams): Promise<IDashboardRevenueByVehicleResponse> {
    return this.api
      .get<IDashboardRevenueByVehicleResponse>("/dashboard/revenue-by-vehicle", { params })
      .then((r) => r.data);
  }

  async getPeakHours(params: IDashboardDateRangeParams): Promise<IDashboardPeakHoursResponse> {
    return this.api
      .get<IDashboardPeakHoursResponse>("/dashboard/peak-hours", { params })
      .then((r) => r.data);
  }

  async getStayDuration(params: IDashboardDateRangeParams): Promise<IDashboardStayDurationResponse> {
    return this.api
      .get<IDashboardStayDurationResponse>("/dashboard/stay-duration", { params })
      .then((r) => r.data);
  }

  async getPaymentMethods(params: IDashboardDateRangeParams): Promise<IDashboardPaymentMethodsResponse> {
    return this.api
      .get<IDashboardPaymentMethodsResponse>("/dashboard/payment-methods", { params })
      .then((r) => r.data);
  }

  async getDailyComparison(): Promise<IDashboardDailyComparisonResponse> {
    return this.api
      .get<IDashboardDailyComparisonResponse>("/dashboard/daily-comparison")
      .then((r) => r.data);
  }
}
