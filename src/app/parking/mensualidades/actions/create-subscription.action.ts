"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { SubscriptionUsecase, ICreateSubscriptionParamsEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";
import { AxiosError } from "axios";

type CreateSubscriptionActionResponse = Promise<IActionResponse<IEmptyResponse>>;

export async function createSubscriptionAction(
  params: ICreateSubscriptionParamsEntity
): CreateSubscriptionActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.createSubscription(params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in createSubscriptionAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al crear la mensualidad",
    };
  }
}
