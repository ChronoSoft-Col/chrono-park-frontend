"use server";

import { serverContainer } from "@/server/di/container";
import { ClosureUsecase } from "@/server/domain/usecases/parking/closure.usecase";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { IClosureEntity } from "@/server/domain";

export async function getClosureByIdAction(
  id: string
): Promise<IActionResponse<IClosureEntity>> {
  try {
    const closureUsecase = serverContainer.resolve<ClosureUsecase>(SERVER_TOKENS.ClosureUsecase);
    const closure = await closureUsecase.getClosureById(id);
    
    return {
      success: true,
      data: closure,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error getting closure:", error);
    return {
      success: false,
      error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error al obtener el cierre",
    };
  }
}
