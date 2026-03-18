"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import {
  SubscriptionUsecase,
  IEditSubscriptionEndDateParamsEntity,
  ISubscriptionEntity,
} from "@/server/domain";
import type IActionResponse from "@/shared/interfaces/generic/action-response";
import type IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import type IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { AxiosError } from "axios";

type EditSubscriptionEndDateActionResponse = Promise<
  IActionResponse<IGeneralResponse<ISubscriptionEntity>>
>;

export async function editSubscriptionEndDateAction(
  subscriptionId: string,
  params: IEditSubscriptionEndDateParamsEntity,
): EditSubscriptionEndDateActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase,
    );
    const response = await useCase.editSubscriptionEndDate(subscriptionId, params);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in editSubscriptionEndDateAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al editar la fecha de fin de la suscripción",
    };
  }
}
