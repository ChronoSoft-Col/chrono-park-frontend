'use server'

import { serverContainer } from "@/server/di/container";
import { IGeneratePaymentParamsEntity, IGeneratePaymentResponseEntity, PaymentUsecase } from "@/server/domain/index";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function generatePaymentAction(params: IGeneratePaymentParamsEntity): Promise<IActionResponse<IGeneratePaymentResponseEntity>> {
    try {
        console.log("generatePaymentAction params:", params);
        const useCase = serverContainer.resolve(PaymentUsecase);
        const response = await useCase.generatePayment(params);
        
        console.log("generatePaymentAction response:", response);
        
        return {
            data: response,
            success: true
        };
    } catch (error) {
        console.log("generatePaymentAction error:", (error as AxiosError).response?.data);
        return {
            success: false,
            error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado al procesar el pago"
        };
    }   
}
