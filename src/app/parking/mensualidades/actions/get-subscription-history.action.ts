"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { SubscriptionUsecase, IGetSubscriptionHistoryResponseEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

type GetSubscriptionHistoryActionResponse = Promise<
  IActionResponse<IGetSubscriptionHistoryResponseEntity>
>;

export async function getSubscriptionHistoryAction(
  customerId: string
): GetSubscriptionHistoryActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.getCustomerSubscriptionHistory(customerId);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in getSubscriptionHistoryAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al obtener el historial",
    };
  }
}
