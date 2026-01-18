'use server'

import { serverContainer } from "@/server/di/container";
import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { IGenerateManualIncomeParamsEntity, ManualControlUseCase } from "@/server/domain";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/src/lib/next-navigation-errors";

export async function generateManualIncomeAction(params: IGenerateManualIncomeParamsEntity): Promise<IActionResponse<unknown>> {
    try {
        const useCase = serverContainer.resolve(ManualControlUseCase);
        const response = await useCase.generateManualIncome(params);
        return { success: true, data: response };
    } catch (error) {
        rethrowNextNavigationErrors(error);
        console.log("Error en generateManualIncomeAction:", error);
        return { success: false, error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado"};
    }
}