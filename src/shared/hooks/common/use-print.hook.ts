'use client'

import { useCallback } from "react";
import { PrintUsecase } from "@/client/domain/usecases/printer/print.usecase";
import { clientContainer } from "@/client/di/container";
import IActionResponse from "../../interfaces/generic/action-response";
import { IClosureEntity } from "@/server/domain/entities/parking/closures/closure.entity";
import { TPrintIncomeBody } from "@/src/shared/types/parking/print-income-body.type";
import { getPaymentPrintTicketAction } from "@/src/app/parking/cobro/actions/get-payment-print-ticket.action";

export function usePrint() {
  const isUuidV4 = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

  const printClosureReceipt = useCallback(
    async (
      closure: IClosureEntity,
      options?: { operatorName?: string }
    ): Promise<IActionResponse<boolean>> => {
    try {
      const useCase = clientContainer.resolve(PrintUsecase);
      const result = await useCase.printClosureReceipt(closure, options);
      return {
        success: result,
        data: result,
      };
    } catch (error) {
      console.error("Error printing closure:", error);
      return {
        success: false,
        data: false,
      };
    }
  }, []);

  const printIncomeReceipt = useCallback(async (body: TPrintIncomeBody): Promise<IActionResponse<boolean>> => {
    try {
      const useCase = clientContainer.resolve(PrintUsecase);
      const result = await useCase.printIncomeReceipt(body);
      return {
        success: result,
        data: result,
      };
    } catch (error) {
      console.error("Error printing income receipt:", error);
      return {
        success: false,
        data: false,
      };
    }
  }, []);

  const printPaymentTicketByPaymentId = useCallback(
    async (paymentId: string): Promise<IActionResponse<boolean>> => {
      try {
        if (!paymentId) {
          return {
            success: false,
            data: false,
            error: "No se recibió paymentId para imprimir",
          };
        }

        if (!isUuidV4(paymentId)) {
          return {
            success: false,
            data: false,
            error: `paymentId inválido (se espera UUID v4): ${paymentId}`,
          };
        }

        const ticketRes = await getPaymentPrintTicketAction(paymentId);
        if (!ticketRes.success || !ticketRes.data?.data) {
          return {
            success: false,
            data: false,
            error: ticketRes.error || "Error al obtener el ticket",
          };
        }

        const useCase = clientContainer.resolve(PrintUsecase);
        const printed = await useCase.printTransactionReceipt(ticketRes.data.data);

        return {
          success: printed,
          data: printed,
          error: printed
            ? undefined
            : "Error al enviar a la impresora. Verifica que el servicio de impresión esté activo y permita CORS.",
        };
      } catch (error) {
        console.error("Error printing payment ticket:", error);
        return {
          success: false,
          data: false,
          error: "Error inesperado al imprimir",
        };
      }
    },
    [],
  );

  return {
    printClosureReceipt,
    printIncomeReceipt,
    printPaymentTicketByPaymentId,
  };
}

