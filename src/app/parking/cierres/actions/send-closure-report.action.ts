"use server";

import { serverContainer } from "@/server/di/container";
import { ClosureUsecase } from "@/server/domain/usecases/parking/closure.usecase";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import type IActionResponse from "@/shared/interfaces/generic/action-response";
import type IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

export async function sendClosureReportAction(
  id: string,
  emails: string
): Promise<IActionResponse<{ message: string }>> {
  try {
    const closureUsecase = serverContainer.resolve<ClosureUsecase>(
      SERVER_TOKENS.ClosureUsecase
    );
    const result = await closureUsecase.sendReport(id, emails);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error(
      "Error sending closure report:",
      (error as AxiosError<IErrorResponse>).response?.data
    );

    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ||
        "Error al enviar el reporte de cierre",
    };
  }
}
