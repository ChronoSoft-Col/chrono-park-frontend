"use server";

import { serverContainer } from "@/server/di/container";
import { ClosureUsecase } from "@/server/domain/usecases/parking/closure.usecase";
import { ICloseClosureParamsEntity } from "@/server/domain/entities/parking/close-closure-params.entity";
import { IClosureEntity } from "@/server/domain/entities/parking/closure.entity";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function createClosureAction(
  params: ICloseClosureParamsEntity
): Promise<IActionResponse<IClosureEntity>> {
  try {
    const closureUsecase = serverContainer.resolve(ClosureUsecase);
    const closure = await closureUsecase.createClosure(params);
    
    return {
      success: true,
      data: closure,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error al crear el cierre",
    };
  }
}
