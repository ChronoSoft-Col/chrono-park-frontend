"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { UserUsecase } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function deleteUserAction(
  userId: string,
): Promise<IActionResponse<void>> {
  try {
    const useCase = serverContainer.resolve<UserUsecase>(SERVER_TOKENS.UserUsecase);
    await useCase.deleteUser(userId);
    return { success: true };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al eliminar el usuario",
    };
  }
}
