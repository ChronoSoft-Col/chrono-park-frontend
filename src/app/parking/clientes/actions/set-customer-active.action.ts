"use server";

import { rethrowNextNavigationErrors } from "@/src/lib/next-navigation-errors";
import { serverContainer } from "@/src/server/di/container";
import { CustomerUsecase } from "@/src/server/domain";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function setCustomerActiveAction(
  customerId: string,
  isActive: boolean,
): Promise<IActionResponse<IEmptyResponse | void>> {
  try {
    const useCase = serverContainer.resolve(CustomerUsecase);
    const response = await useCase.setCustomerActive(customerId, isActive);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al actualizar el estado del cliente",
    };
  }
}
