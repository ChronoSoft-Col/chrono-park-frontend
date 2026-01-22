"use server";

import { rethrowNextNavigationErrors } from "@/src/lib/next-navigation-errors";
import { serverContainer } from "@/src/server/di/container";
import { CustomerUsecase, IUpdateCustomerParamsEntity, IUpdateCustomerResponseEntity } from "@/src/server/domain";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function updateCustomerAction(
  customerId: string,
  params: IUpdateCustomerParamsEntity,
): Promise<IActionResponse<IUpdateCustomerResponseEntity>> {
  try {
    const useCase = serverContainer.resolve(CustomerUsecase);
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
