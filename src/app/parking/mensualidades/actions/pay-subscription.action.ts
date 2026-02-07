"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { SubscriptionUsecase, IPaySubscriptionParamsEntity, ISubscriptionEntity, IPriceCalculation } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { AxiosError } from "axios";

type PaySubscriptionResult = {
  subscription: ISubscriptionEntity;
  calculation: IPriceCalculation;
  paymentId: string;
};

type PaySubscriptionActionResponse = Promise<
  IActionResponse<IGeneralResponse<PaySubscriptionResult>>
>;

export async function paySubscriptionAction(
  subscriptionId: string,
  params: IPaySubscriptionParamsEntity
): PaySubscriptionActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.paySubscription(subscriptionId, params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in paySubscriptionAction:", JSON.stringify((error as AxiosError<IErrorResponse>).response?.data));
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al procesar el pago",
    };
  }
}
