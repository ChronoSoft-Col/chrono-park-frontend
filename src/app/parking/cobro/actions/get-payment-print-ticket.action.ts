'use server'

import { serverContainer } from "@/server/di/container";
import {
  IPrintPaymentTicketResponseEntity,
  PaymentUsecase,
} from "@/server/domain";
import { rethrowNextNavigationErrors } from "@/src/lib/next-navigation-errors";
import type IActionResponse from "@/src/shared/interfaces/generic/action-response";
import type IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function getPaymentPrintTicketAction(
  paymentId: string,
): Promise<IActionResponse<IPrintPaymentTicketResponseEntity>> {
  try {
    const useCase = serverContainer.resolve(PaymentUsecase);
    const response = await useCase.getPaymentPrintTicket(paymentId);
    console.log("getPaymentPrintTicketAction response:", response);
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
