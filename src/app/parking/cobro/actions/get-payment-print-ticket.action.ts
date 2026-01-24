'use server'

import { serverContainer } from "@/server/di/container";
import {
  IPrintPaymentTicketResponseEntity,
  PaymentUsecase,
} from "@/server/domain";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import type IActionResponse from "@/shared/interfaces/generic/action-response";
import type IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function getPaymentPrintTicketAction(
  paymentId: string,
): Promise<IActionResponse<IPrintPaymentTicketResponseEntity>> {
  try {
    const useCase = serverContainer.resolve<PaymentUsecase>(SERVER_TOKENS.PaymentUsecase);
    const response = await useCase.getPaymentPrintTicket(paymentId);
    console.log("getPaymentPrintTicketAction response:", JSON.stringify(response));
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ||
        "Error inesperado al obtener el ticket de pago",
    };
  }
}
