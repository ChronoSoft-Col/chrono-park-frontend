import { IGetPaymentsReportParams } from "../../entities/parking/reports/params/get-payments-report-params.entity";
import { TPaymentsReportResponse } from "../../entities/parking/reports/response/payments-report-response.entity";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export abstract class ReportRepository {
  abstract getPaymentsReport(params: IGetPaymentsReportParams): Promise<IGeneralResponse<TPaymentsReportResponse>>;
}
