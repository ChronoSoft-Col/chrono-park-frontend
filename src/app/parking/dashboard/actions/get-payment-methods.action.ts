'use server'

import { DashboardUsecase } from "@/server/domain/index";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { IDashboardDateRangeParams } from "@/server/domain/entities/parking/dashboard/params/dashboard-date-range-params.entity";
import { IDashboardPaymentMethodsData } from "@/server/domain/entities/parking/dashboard/response/dashboard-payment-methods-response.entity";

export async function getPaymentMethodsAction(params: IDashboardDateRangeParams): Promise<IActionResponse<IDashboardPaymentMethodsData>> {
  try {
    const useCase = serverContainer.resolve<DashboardUsecase>(SERVER_TOKENS.DashboardUsecase);
    const response = await useCase.getPaymentMethods(params);
    return { data: response.data, success: true };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return {
      success: false,
      error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error al obtener métodos de pago",
    };
  }
}
