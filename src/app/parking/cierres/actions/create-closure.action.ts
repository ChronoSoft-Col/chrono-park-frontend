"use server";

import { serverContainer } from "@/server/di/container";
import { ClosureUsecase } from "@/server/domain/usecases/parking/closure.usecase";
import { ICloseClosureParamsEntity } from "@/server/domain/entities/parking/closures/params/close-closure-params.entity";
import { IClosureEntity } from "@/server/domain/entities/parking/closures/closure.entity";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

export async function createClosureAction(
  params: ICloseClosureParamsEntity
): Promise<IActionResponse<IClosureEntity>> {
  try {
    const closureUsecase = serverContainer.resolve<ClosureUsecase>(SERVER_TOKENS.ClosureUsecase);
    const closure = await closureUsecase.createClosure(params);
    
    return {
      success: true,
      data: closure,
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error al crear el cierre",
    };
  }
}
