"use server";

import { AxiosError } from "axios";

import { serverContainer } from "@/server/di/container";
import { LoginUseCase } from "@/server/domain/index";
import type { ILoginParams } from "@/server/domain/entities/auth/login-params.entity";
// company/permission types not used here; kept in todo for future mapping
import type { TApplication } from "@/src/shared/types/auth/application.type";
import type IActionResponse from "@/src/shared/interfaces/generic/action-response";
// TUser is not used directly here
import type { SessionTokens, SessionUser } from "@/src/shared/types/auth/session.type";
import type IErrorResponse from "@/src/shared/interfaces/generic/error-response.interface";
import { createSession } from "@/src/lib/session";

export type LoginActionResult = {
  user: SessionUser;
  applications?: TApplication[];
  role?: { id: string; name: string } | null;
};

function mapTokensFromPayload(payload: Record<string, unknown>): SessionTokens {
  return {
    accessToken: (payload["access_token"] as string) || (payload["accessToken"] as string) || "",
    refreshToken: (payload["refresh_token"] as string) || (payload["refreshToken"] as string) || undefined,
  };
}

export async function loginAction(
  params: ILoginParams
): Promise<IActionResponse<LoginActionResult>> {
  try {
    const useCase = serverContainer.resolve(LoginUseCase);
    const response = await useCase.execute(params);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.message || "No se pudo iniciar sesión",
      };
    }

    // New backend shape: { success, message, data: { access_token, refresh_token, role, user, applications } }
    const payload = response.data as unknown as Record<string, unknown>;

    const tokens = mapTokensFromPayload(payload);
    const userRaw = (payload["user"] as Record<string, unknown>) ?? {};

    const sessionUser: SessionUser = {
      id: (userRaw.id as string) || "",
      email: (userRaw.email as string) || undefined,
      name: (userRaw.name as string) || undefined,
      ...userRaw,
    };

    const applications = (payload["applications"] as TApplication[]) || [];
    const role = (payload["role"] as { id: string; name: string }) || null;

    await createSession({
      user: sessionUser,
      permissions: null,
      tokens,
      role,
      applications,
    });

    return {
      success: true,
      data: {
        user: sessionUser,
        applications,
        role,
      },
    };
  } catch (error) {
    const axiosError = error as AxiosError<IErrorResponse>;
    console.error("Error en loginAction:", axiosError);
    const message =
      axiosError.response?.data?.message ??
      axiosError.message ??
      "No se pudo iniciar sesión";

    return {
      success: false,
      error: message,
    };
  }
}
