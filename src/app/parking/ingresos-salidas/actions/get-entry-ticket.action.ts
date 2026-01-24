'use server'

import { serverContainer } from "@/server/di/container";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { ManualControlUseCase } from "@/server/domain";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { TPrintIncomeBody } from "@/shared/types/parking/print-income-body.type";

export async function getEntryTicketAction(parkingSessionId: string): Promise<IActionResponse<TPrintIncomeBody>> {
    try {
        const useCase = serverContainer.resolve<ManualControlUseCase>(SERVER_TOKENS.ManualControlUseCase);
        const response = await useCase.getEntryTicket(parkingSessionId);
        return { success: true, data: response.data };
    } catch (error) {
        rethrowNextNavigationErrors(error);
        console.log("Error en getEntryTicketAction:", error);
        return { success: false, error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado"};
    }
}
