// lib/api/server.ts
import axios, { AxiosError } from "axios";
import { ENVIRONMENT } from "../shared/constants/environment";
import { getSession } from "./session";
import { redirect } from "next/navigation";
import {
  LICENSE_BLOCKED_MESSAGE,
  SKIP_LICENSE_REDIRECT_HEADER,
  SUBSCRIPTION_BLOCKED_PATH,
} from "./license-redirect";

let apiServer: ReturnType<typeof axios.create> | null = null;

function readSkipHeader(headers: unknown): boolean {
  if (!headers) return false;
  const h = headers as Record<string, unknown> & {
    get?: (key: string) => unknown;
    has?: (key: string) => boolean;
  };
  if (typeof h.get === "function") {
    const v = h.get(SKIP_LICENSE_REDIRECT_HEADER);
    if (v != null && String(v).length > 0) return true;
  }
  for (const key of Object.keys(h)) {
    if (key.toLowerCase() === SKIP_LICENSE_REDIRECT_HEADER.toLowerCase()) {
      const v = (h as Record<string, unknown>)[key];
      return v != null && String(v).length > 0;
    }
  }
  return false;
}

export function getServerApi(queryParams?: Record<string, unknown>) {
  if (apiServer) return apiServer;

  apiServer = axios.create({
    baseURL: ENVIRONMENT.API_URL,
    headers: { "Content-Type": "application/json" },
  });

  // Interceptor: auth (token de sesión en server)
  apiServer.interceptors.request.use(async (config) => {
    const session = await getSession();
    const token = session?.tokens?.accessToken;

    if (token) {
      const headers = (config.headers = config.headers ?? {});
      const hasAuthHeader =
        (typeof (headers as { has?: (key: string) => boolean }).has === "function" &&
          (headers as { has: (key: string) => boolean }).has("Authorization")) ||
        (typeof (headers as { get?: (key: string) => string | undefined }).get === "function" &&
          Boolean((headers as { get: (key: string) => string | undefined }).get("Authorization"))) ||
        (headers && "Authorization" in (headers as Record<string, unknown>));

      if (!hasAuthHeader) {
        if (typeof (headers as { set?: (key: string, value: string) => void }).set === "function") {
          (headers as { set: (key: string, value: string) => void }).set(
            "Authorization",
            `Bearer ${token}`
          );
        } else {
          (config.headers as Record<string, unknown>)["Authorization"] = `Bearer ${token}`;
        }
      }
    }

    // Si la petición es GET y me pasaron queryParams desde el handler
    if (config.method?.toLowerCase() === "get" && queryParams) {
      config.params = {
        ...queryParams, // params del request actual
        ...config.params, // los que pases manualmente en el .get()
      };
    }

    return config;
  });

  apiServer.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const requestUrl = error.config?.url ?? "";

      // 🧠 Si la URL contiene /auth/login, no ejecutar el interceptor de error
      if (requestUrl.includes("/auth/login")) {
        return Promise.reject(error);
      }

      if (status === 403) {
        const data = error.response?.data as
          | { message?: string; error?: string }
          | undefined;
        const skip = readSkipHeader(error.config?.headers);
        if (data?.message === LICENSE_BLOCKED_MESSAGE && !skip) {
          const reason = data?.error ?? "";
          redirect(
            `${SUBSCRIPTION_BLOCKED_PATH}?reason=${encodeURIComponent(reason)}`
          );
        }
      }

      // 🔐 Si hay un 401, cerrar sesión automáticamente
      if (status === 401) {
        // Nota: en Server Components no se pueden modificar cookies.
        // Redirigimos a un Route Handler que sí puede destruir la cookie y luego mandar al login.
        redirect(
          `/api-cs/session/logout?next=${encodeURIComponent("/auth/login?reason=expired")}`
        );
      }

      return Promise.reject(error);
    }
  );


  return apiServer;
}
