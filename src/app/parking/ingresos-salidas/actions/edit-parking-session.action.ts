"use server";

import { serverContainer } from "@/server/di/container";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import IActionResponse from "@/shared/interfaces/generic/action-response";
import IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { ManualControlUseCase, IEditParkingSessionParamsEntity } from "@/server/domain";
import { AxiosError } from "axios";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";
import { revalidatePath } from "next/cache";

export async function editParkingSessionAction(
  parkingSessionId: string,
  params: IEditParkingSessionParamsEntity,
): Promise<IActionResponse<void>> {
  try {
    const useCase = serverContainer.resolve<ManualControlUseCase>(
      SERVER_TOKENS.ManualControlUseCase,
    );
    await useCase.editParkingSession(parkingSessionId, params);
    revalidatePath("/parking/ingresos-salidas");
    return { success: true, data: undefined };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    console.log("Error en editParkingSessionAction:", error);
    return {
      success: false,
      error:
        (error as AxiosError<IErrorResponse>).response?.data.message ||
        "Error inesperado",
    };
  }
}
