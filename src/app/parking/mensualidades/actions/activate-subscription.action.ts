"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import {
  SubscriptionUsecase,
  IActivateSubscriptionParamsEntity,
  ISubscriptionEntity,
} from "@/server/domain";
import type IActionResponse from "@/shared/interfaces/generic/action-response";
import type IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import type IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { AxiosError } from "axios";

type ActivateSubscriptionActionResponse = Promise<
  IActionResponse<IGeneralResponse<ISubscriptionEntity>>
>;

export async function activateSubscriptionAction(
  subscriptionId: string,
  params: IActivateSubscriptionParamsEntity,
): ActivateSubscriptionActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase,
    );
    const response = await useCase.activateSubscription(subscriptionId, params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in activateSubscriptionAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al activar la suscripción",
    };
  }
}
