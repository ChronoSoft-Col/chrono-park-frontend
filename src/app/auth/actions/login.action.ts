"use server";

import { AxiosError } from "axios";

import { serverContainer } from "@/server/di/container";
import { ILoginParams, LoginUseCase } from "@/server/domain/index";
// company/permission types not used here; kept in todo for future mapping
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import type { TApplication } from "@/shared/types/auth/application.type";
import type IActionResponse from "@/shared/interfaces/generic/action-response";
import type { SessionApplication, SessionTokens, SessionUser } from "@/shared/types/auth/session.type";
import type IErrorResponse from "@/shared/interfaces/generic/error-response.interface";
import { createSession } from "@/lib/session";
import { slimApplications, buildPermissionsFromApplications } from "@/lib/session-schema";
import { rethrowNextNavigationErrors } from "@/lib/next-navigation-errors";

export type LoginActionResult = {
  user: SessionUser;
  applications: SessionApplication[];
  permissions: string[];
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
    const useCase = serverContainer.resolve<LoginUseCase>(SERVER_TOKENS.LoginUseCase);
    const response = await useCase.execute(params);
    console.log(JSON.stringify(response))
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
    };

    const applications = (payload["applications"] as TApplication[]) || [];
    const role = (payload["role"] as { id: string; name: string }) || null;

    // Cookie slim: solo user, tokens y role (sin applications ni permissions)
    await createSession({
      user: sessionUser,
      tokens,
      role,
    });

    // Retornar permissions y applications para que el cliente las guarde en Zustand
    const slimApps = slimApplications(applications);
    const permissions = buildPermissionsFromApplications(applications);

    return {
      success: true,
      data: {
        user: sessionUser,
        applications: slimApps,
        permissions: permissions.actions,
        role,
      },
    };
  } catch (error) {
    rethrowNextNavigationErrors(error);
    const axiosError = error as AxiosError<IErrorResponse>;
    console.error("Error en loginAction:", JSON.stringify(axiosError.response?.data || axiosError.message || error));
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
