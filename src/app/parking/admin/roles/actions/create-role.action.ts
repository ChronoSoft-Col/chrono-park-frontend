"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { RoleUsecase, ICreateRoleParamsEntity, ICreateRoleResponseEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function createRoleAction(
  params: ICreateRoleParamsEntity,
): Promise<IActionResponse<ICreateRoleResponseEntity>> {
  try {
    const useCase = serverContainer.resolve<RoleUsecase>(SERVER_TOKENS.RoleUsecase);
    const response = await useCase.createRole(params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al crear el rol",
    };
  }
}
