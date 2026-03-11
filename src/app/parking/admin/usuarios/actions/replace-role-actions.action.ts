"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { RoleUsecase } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function replaceRoleActionsAction(
  roleId: string,
  actionIds: string[],
): Promise<IActionResponse<void>> {
  try {
    const useCase = serverContainer.resolve<RoleUsecase>(SERVER_TOKENS.RoleUsecase);
    await useCase.replaceRoleActions(roleId, actionIds);
    return { success: true };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al actualizar los permisos del rol",
    };
  }
}
