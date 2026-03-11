"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { RoleUsecase, IUpdateRoleParamsEntity, IGetRoleResponseEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function updateRoleAction(
  roleId: string,
  params: IUpdateRoleParamsEntity,
): Promise<IActionResponse<IGetRoleResponseEntity>> {
  try {
    const useCase = serverContainer.resolve<RoleUsecase>(SERVER_TOKENS.RoleUsecase);
    const response = await useCase.updateRole(roleId, params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al actualizar el rol",
    };
  }
}
