import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { DashboardRepository } from "@/server/domain/index";
import { DashboardDatasourceService } from "@/server/infrastructure/datasources/parking/dashboard-datasource.service";
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
export class DashboardRepositoryImp implements DashboardRepository {
  constructor(
    @inject(SERVER_TOKENS.DashboardDatasourceService)
    private dashboardDatasourceService: DashboardDatasourceService
  ) {}

  async getOverview(): Promise<IDashboardOverviewResponse> {
    return this.dashboardDatasourceService.getOverview();
  }

  async getTraffic(params: IDashboardGroupedParams): Promise<IDashboardTrafficResponse> {
    return this.dashboardDatasourceService.getTraffic(params);
  }

  async getTransactions(params: IDashboardGroupedParams): Promise<IDashboardTransactionsResponse> {
    return this.dashboardDatasourceService.getTransactions(params);
  }

  async getRevenueByVehicle(params: IDashboardDateRangeParams): Promise<IDashboardRevenueByVehicleResponse> {
    return this.dashboardDatasourceService.getRevenueByVehicle(params);
  }

  async getPeakHours(params: IDashboardDateRangeParams): Promise<IDashboardPeakHoursResponse> {
    return this.dashboardDatasourceService.getPeakHours(params);
  }

  async getStayDuration(params: IDashboardDateRangeParams): Promise<IDashboardStayDurationResponse> {
    return this.dashboardDatasourceService.getStayDuration(params);
  }

  async getPaymentMethods(params: IDashboardDateRangeParams): Promise<IDashboardPaymentMethodsResponse> {
    return this.dashboardDatasourceService.getPaymentMethods(params);
  }

  async getDailyComparison(): Promise<IDashboardDailyComparisonResponse> {
    return this.dashboardDatasourceService.getDailyComparison();
  }
}
