import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { ReportRepository } from "@/server/domain/index";
import { ReportDatasourceService } from "@/server/infrastructure/datasources/parking/report-datasource.service";
import { IGetPaymentsReportParams } from "@/server/domain/entities/parking/reports/params/get-payments-report-params.entity";
import { TPaymentsReportResponse } from "@/server/domain/entities/parking/reports/response/payments-report-response.entity";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

@injectable()
export class ReportRepositoryImp implements ReportRepository {
  constructor(
    @inject(SERVER_TOKENS.ReportDatasourceService)
    private reportDatasourceService: ReportDatasourceService
  ) {}

  async getPaymentsReport(params: IGetPaymentsReportParams): Promise<IGeneralResponse<TPaymentsReportResponse>> {
    return this.reportDatasourceService.getPaymentsReport(params);
  }
}
