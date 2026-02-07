"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { SubscriptionUsecase, ISubscriptionEntity, ISubscriptionPayment, ISubscriptionStatusLog } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { AxiosError } from "axios";

// Obtener suscripciones de un cliente
type GetCustomerSubscriptionsActionResponse = Promise<
  IActionResponse<IGeneralResponse<ISubscriptionEntity, false>>
>;

export async function getCustomerSubscriptionsAction(
  customerId: string
): GetCustomerSubscriptionsActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.getSubscriptionsByCustomer(customerId);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in getCustomerSubscriptionsAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al obtener las suscripciones del cliente",
    };
  }
}

// Obtener historial de pagos de una suscripción
type GetPaymentHistoryActionResponse = Promise<
  IActionResponse<IGeneralResponse<ISubscriptionPayment, false>>
>;

export async function getPaymentHistoryAction(
  subscriptionId: string
): GetPaymentHistoryActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.getPaymentHistory(subscriptionId);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in getPaymentHistoryAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al obtener el historial de pagos",
    };
  }
}

// Obtener historial de estados de una suscripción
type GetStatusHistoryActionResponse = Promise<
  IActionResponse<IGeneralResponse<ISubscriptionStatusLog, false>>
>;

export async function getStatusHistoryAction(
  subscriptionId: string
): GetStatusHistoryActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.getStatusHistory(subscriptionId);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in getStatusHistoryAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al obtener el historial de estados",
    };
  }
}
