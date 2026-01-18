'use server'

import { IValidateAmountParamsEntity, IValidateAmountResponseEntity, PaymentUsecase } from "@/server/domain/index";
import { serverContainer } from "@/src/server/di/container";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/src/lib/next-navigation-errors";

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
        rethrowNextNavigationErrors(error);
        console.log("validateFeeAction error:", (error as AxiosError<IErrorResponse>).response?.data);
        return {
            success: false,
            error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado"
        };
    }   
}