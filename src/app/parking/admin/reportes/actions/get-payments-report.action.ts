'use server'

import { ReportUsecase } from "@/server/domain/index";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { IGetPaymentsReportParams } from "@/server/domain/entities/parking/reports/params/get-payments-report-params.entity";
import { TPaymentsReportResponse } from "@/server/domain/entities/parking/reports/response/payments-report-response.entity";

export async function getPaymentsReportAction(
  params: IGetPaymentsReportParams
): Promise<IActionResponse<TPaymentsReportResponse>> {
  try {
    const usecase = serverContainer.resolve<ReportUsecase>(SERVER_TOKENS.ReportUsecase);
    const response = await usecase.getPaymentsReport(params);
    return { success: true, data: response.data };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error al generar el reporte",
    };
  }
}
