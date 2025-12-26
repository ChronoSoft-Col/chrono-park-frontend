'use server'

import { serverContainer } from "@/server/di/container";
import { IValidateAmountParamsEntity, IValidateAmountResponseEntity, PaymentUsecase } from "@/server/domain/index";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";

export async function validateFeeAction(params: IValidateAmountParamsEntity): Promise<IActionResponse<IValidateAmountResponseEntity>> {
    try {
        console.log("validateFeeAction params:", params);
        const useCase = serverContainer.resolve(PaymentUsecase);
        const response = await useCase.validateFee(params);
        return {
            data: response,
            success: true
        };
    } catch (error) {
        console.log("validateFeeAction error:", (error as AxiosError<IErrorResponse>).response?.data);
        return {
            success: false,
            error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado"
        };
    }   
}