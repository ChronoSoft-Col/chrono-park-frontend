import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
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
export class DashboardUsecase implements DashboardRepository {
  constructor(
    @inject(SERVER_TOKENS.DashboardRepository) private dashboardRepository: DashboardRepository
  ) {}

  getOverview(): Promise<IDashboardOverviewResponse> {
    return this.dashboardRepository.getOverview();
  }

  getTraffic(params: IDashboardGroupedParams): Promise<IDashboardTrafficResponse> {
    return this.dashboardRepository.getTraffic(params);
  }

  getTransactions(params: IDashboardGroupedParams): Promise<IDashboardTransactionsResponse> {
    return this.dashboardRepository.getTransactions(params);
  }

  getRevenueByVehicle(params: IDashboardDateRangeParams): Promise<IDashboardRevenueByVehicleResponse> {
    return this.dashboardRepository.getRevenueByVehicle(params);
  }

  getPeakHours(params: IDashboardDateRangeParams): Promise<IDashboardPeakHoursResponse> {
    return this.dashboardRepository.getPeakHours(params);
  }

  getStayDuration(params: IDashboardDateRangeParams): Promise<IDashboardStayDurationResponse> {
    return this.dashboardRepository.getStayDuration(params);
  }

  getPaymentMethods(params: IDashboardDateRangeParams): Promise<IDashboardPaymentMethodsResponse> {
    return this.dashboardRepository.getPaymentMethods(params);
  }

  getDailyComparison(): Promise<IDashboardDailyComparisonResponse> {
    return this.dashboardRepository.getDailyComparison();
  }
}
