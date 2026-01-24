"use server";

import { serverContainer } from "@/server/di/container";
import { ClosureUsecase } from "@/server/domain/usecases/parking/closure.usecase";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import type IActionResponse from "@/shared/interfaces/generic/action-response";
import type IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import type { IClosureEntity } from "@/server/domain/entities/parking/closures/closure.entity";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

export async function getClosureByIdAction(id: string): Promise<IActionResponse<IClosureEntity>> {
  try {
    const closureUsecase = serverContainer.resolve<ClosureUsecase>(SERVER_TOKENS.ClosureUsecase);
    const result = await closureUsecase.getClosureById(id);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error getting closure by id:", (error as AxiosError<IErrorResponse>).response?.data);

    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ||
        "Error al obtener el cierre",
    };
  }
}
