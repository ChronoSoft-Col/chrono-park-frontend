"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { UserUsecase, IUpdateUserParamsEntity, IGetUserResponseEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function updateUserAction(
  userId: string,
  params: IUpdateUserParamsEntity,
): Promise<IActionResponse<IGetUserResponseEntity>> {
  try {
    const useCase = serverContainer.resolve<UserUsecase>(SERVER_TOKENS.UserUsecase);
    const response = await useCase.updateUser(userId, params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al actualizar el usuario",
    };
  }
}
