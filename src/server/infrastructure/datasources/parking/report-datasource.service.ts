import { injectable } from "tsyringe";
import { AxiosServerInstance } from "@/server/infrastructure/index";
import { ReportRepository } from "@/server/domain/index";
import { IGetPaymentsReportParams } from "@/server/domain/entities/parking/reports/params/get-payments-report-params.entity";
import { TPaymentsReportResponse } from "@/server/domain/entities/parking/reports/response/payments-report-response.entity";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

@injectable()
export class ReportDatasourceService extends AxiosServerInstance implements ReportRepository {

  async getPaymentsReport(params: IGetPaymentsReportParams): Promise<IGeneralResponse<TPaymentsReportResponse>> {
    return this.api
      .post<IGeneralResponse<TPaymentsReportResponse>>("/reports/payments", params)
      .then((r) => r.data);
  }
}
