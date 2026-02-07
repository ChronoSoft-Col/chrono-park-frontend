"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { SubscriptionUsecase, IPriceCalculation } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { AxiosError } from "axios";

type CalculatePriceActionResponse = Promise<
  IActionResponse<IGeneralResponse<IPriceCalculation>>
>;

export async function calculatePriceAction(
  subscriptionId: string,
  monthsCount?: number
): CalculatePriceActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.calculatePrice(subscriptionId, monthsCount);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in calculatePriceAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al calcular el precio",
    };
  }
}
