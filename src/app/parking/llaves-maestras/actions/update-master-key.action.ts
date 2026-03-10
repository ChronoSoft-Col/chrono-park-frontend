"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { MasterKeysUsecase, IUpdateMasterKeyParamsEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function updateMasterKeyAction(
  id: string,
  params: IUpdateMasterKeyParamsEntity,
): Promise<IActionResponse<IEmptyResponse>> {
  try {
    const useCase = serverContainer.resolve<MasterKeysUsecase>(SERVER_TOKENS.MasterKeysUsecase);
    const response = await useCase.update(id, params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al actualizar llave maestra",
    };
  }
}
