"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { SubscriptionUsecase, ICancelSubscriptionParamsEntity, ISubscriptionEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { AxiosError } from "axios";

type CancelSubscriptionActionResponse = Promise<
  IActionResponse<IGeneralResponse<ISubscriptionEntity>>
>;

export async function cancelSubscriptionAction(
  subscriptionId: string,
  params: ICancelSubscriptionParamsEntity
): CancelSubscriptionActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.cancelSubscription(subscriptionId, params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in cancelSubscriptionAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al cancelar la suscripción",
    };
  }
}
