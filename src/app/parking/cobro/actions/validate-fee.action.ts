'use server'

import { IValidateAmountParamsEntity, IValidateAmountResponseEntity, PaymentUsecase } from "@/server/domain/index";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

export async function validateFeeAction(params: IValidateAmountParamsEntity): Promise<IActionResponse<IValidateAmountResponseEntity>> {
    try {
        console.log("validateFeeAction params:", params);
        const useCase = serverContainer.resolve<PaymentUsecase>(SERVER_TOKENS.PaymentUsecase);
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