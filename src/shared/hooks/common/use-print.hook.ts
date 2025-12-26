'use client'

import { useCallback } from "react";
import { IPrintPostPaymentInvoiceParamsEntity } from "@/server/domain";
import { PrintUsecase } from "@/client/domain/usecases/printer/print.usecase";
import { clientContainer } from "@/client/di/container";
import IActionResponse from "../../interfaces/generic/action-response";
import { IClosureEntity } from "@/server/domain/entities/parking/closure.entity";

export function usePrint() {
  const printPostPaymentInvoice = useCallback(async (paymentData: IPrintPostPaymentInvoiceParamsEntity): Promise<IActionResponse<boolean>> => {
    try {
      const useCase = clientContainer.resolve(PrintUsecase);
      const result = await useCase.printPostPaymentInvoice(paymentData);
      return {
        success: result,
        data: result,
      };
    } catch (error) {
      
      return {
        success: false,
        data: false,
      };
    }
  }, []);

  const printClosureReceipt = useCallback(async (closure: IClosureEntity): Promise<IActionResponse<boolean>> => {
    try {
      const useCase = clientContainer.resolve(PrintUsecase);
      const result = await useCase.printClosureReceipt(closure);
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

  return { printPostPaymentInvoice, printClosureReceipt };
}

