"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { CustomerUsecase, IUpdateCustomerParamsEntity, IUpdateCustomerResponseEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function updateCustomerAction(
  customerId: string,
  params: IUpdateCustomerParamsEntity,
): Promise<IActionResponse<IUpdateCustomerResponseEntity>> {
  try {
    const useCase = serverContainer.resolve<CustomerUsecase>(SERVER_TOKENS.CustomerUsecase);
    const response = await useCase.updateCustomer(customerId, params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al editar el cliente",
    };
  }
}
