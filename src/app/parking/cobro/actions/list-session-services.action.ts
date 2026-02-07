"use server";

import { serverContainer } from "@/server/di/container";
import { 
  SessionServiceUsecase, 
  ISessionServicesResponseEntity 
} from "@/server/domain";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

export async function listSessionServicesAction(
  sessionId: string
): Promise<IActionResponse<ISessionServicesResponseEntity>> {
  try {
    const useCase = serverContainer.resolve<SessionServiceUsecase>(
      SERVER_TOKENS.SessionServiceUsecase
    );
    const response = await useCase.listSessionServices(sessionId);
    return {
      data: response.data,
      success: true,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("listSessionServicesAction error:", (error as AxiosError).response?.data);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ||
        "Error al obtener los servicios de la sesión",
    };
  }
}
