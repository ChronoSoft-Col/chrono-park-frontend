'use server'

import { serverContainer } from "@/server/di/container";

import IActionResponse from "@/src/shared/interfaces/generic/action-response";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { CommonUsecase } from "@/server/domain/index";
import { EServices } from "@/src/shared/enums/common/services.enum";
import { AxiosError } from "axios";
import IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { TRateProfile } from "@/src/shared/types/common/rate-profile.type";

export async function getCommonAction<T = unknown>(
  service: EServices
): Promise<IActionResponse<IGeneralResponse<T>>> {
  try {
    const usecase = serverContainer.resolve(CommonUsecase);
    const response = await usecase.get<T>(service);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado"};
  }
}


export async function getRateProfileAction(vehicleTypeId: string): Promise<IActionResponse<IGeneralResponse<TRateProfile, false>>> {
  try {
    const usecase = serverContainer.resolve(CommonUsecase);
    const response = await usecase.getRateProfiles(vehicleTypeId);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: (error as AxiosError<IErrorResponse>).response?.data.message || "Error inesperado"};
  }
}