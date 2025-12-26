"use server";

import { serverContainer } from "@/server/di/container";
import { ClosureUsecase } from "@/server/domain/usecases/parking/closure.usecase";
import type IActionResponse from "@/src/shared/interfaces/generic/action-response";
import type IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import type { IClosureEntity } from "@/server/domain/entities/parking/closure.entity";
import { AxiosError } from "axios";

export async function getClosureByIdAction(id: string): Promise<IActionResponse<IClosureEntity>> {
  try {
    const closureUsecase = serverContainer.resolve(ClosureUsecase);
    const result = await closureUsecase.getClosureById(id);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error getting closure by id:", (error as AxiosError<IErrorResponse>).response?.data);

    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ||
        "Error al obtener el cierre",
    };
  }
}
