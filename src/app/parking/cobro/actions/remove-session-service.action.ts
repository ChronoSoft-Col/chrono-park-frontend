"use server";

import { serverContainer } from "@/server/di/container";
import { SessionServiceUsecase } from "@/server/domain";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

export async function removeSessionServiceAction(
  sessionId: string,
  serviceId: string
): Promise<IActionResponse<void>> {
  try {
    const useCase = serverContainer.resolve<SessionServiceUsecase>(
      SERVER_TOKENS.SessionServiceUsecase
    );
    await useCase.removeSessionService(sessionId, serviceId);
    return {
      success: true,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("removeSessionServiceAction error:", (error as AxiosError).response?.data);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ||
        "Error al eliminar el servicio",
    };
  }
}
