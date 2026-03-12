import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { ReportRepository } from "@/server/domain/index";
import { IGetPaymentsReportParams } from "@/server/domain/entities/parking/reports/params/get-payments-report-params.entity";
import { TPaymentsReportResponse } from "@/server/domain/entities/parking/reports/response/payments-report-response.entity";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

@injectable()
export class ReportUsecase implements ReportRepository {
  constructor(
    @inject(SERVER_TOKENS.ReportRepository) private reportRepository: ReportRepository
  ) {}

  getPaymentsReport(params: IGetPaymentsReportParams): Promise<IGeneralResponse<TPaymentsReportResponse>> {
    return this.reportRepository.getPaymentsReport(params);
  }
}
