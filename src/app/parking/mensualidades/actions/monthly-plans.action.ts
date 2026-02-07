"use server";

import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { serverContainer } from "@/server/di/container";
import { SubscriptionUsecase, IMonthlyPlanEntity } from "@/server/domain";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { AxiosError } from "axios";

// Obtener todos los planes mensuales
type ListMonthlyPlansActionResponse = Promise<
  IActionResponse<IGeneralResponse<{ plans: IMonthlyPlanEntity[]; total: number }>>
>;

export async function listMonthlyPlansAction(
  onlyActive: boolean = true
): ListMonthlyPlansActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.listMonthlyPlans(onlyActive);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in listMonthlyPlansAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al obtener los planes mensuales",
    };
  }
}

// Obtener planes por tipo de vehículo
type GetPlansByVehicleTypeActionResponse = Promise<
  IActionResponse<IGeneralResponse<IMonthlyPlanEntity, false>>
>;

export async function getMonthlyPlansByVehicleTypeAction(
  vehicleTypeId: string,
  onlyActive: boolean = true
): GetPlansByVehicleTypeActionResponse {
  try {
    const useCase = serverContainer.resolve<SubscriptionUsecase>(
      SERVER_TOKENS.SubscriptionUsecase
    );
    const response = await useCase.getMonthlyPlansByVehicleType(vehicleTypeId, onlyActive);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.error("Error in getMonthlyPlansByVehicleTypeAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ??
        "Error al obtener los planes mensuales",
    };
  }
}
