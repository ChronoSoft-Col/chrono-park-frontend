'use server'

import { serverContainer } from "@/server/di/container";
import { SERVER_TOKENS } from "@/server/di/server-tokens";

import IActionResponse from "@/shared/interfaces/generic/action-response";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";
import { CommonUsecase } from "@/server/domain/index";
import { EServices } from "@/shared/enums/common/services.enum";
import { AxiosError } from "axios";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { TRateProfile } from "@/shared/types/common/rate-profile.type";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

export async function getCommonAction<T = unknown>(
  service: EServices
): Promise<IActionResponse<IGeneralResponse<T>>> {
  try {
    const usecase = serverContainer.resolve<CommonUsecase>(SERVER_TOKENS.CommonUsecase);
    const response = await usecase.get<T>(service);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return { success: false, error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado"};
  }
}


export async function getRateProfileAction(vehicleTypeId: string): Promise<IActionResponse<IGeneralResponse<TRateProfile, false>>> {
  try {
    const usecase = serverContainer.resolve<CommonUsecase>(SERVER_TOKENS.CommonUsecase);
    const response = await usecase.getRateProfiles(vehicleTypeId);
    return { success: true, data: response };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    return { success: false, error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado"};
  }
}