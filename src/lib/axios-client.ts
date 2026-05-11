// src/lib/axios-client.ts
"use client";

import axios, { AxiosInstance } from "axios";
import { ENVIRONMENT } from "../shared/constants/environment";
import { getClientSession, signOut } from "./session-client";
import {
  LICENSE_BLOCKED_MESSAGE,
  SKIP_LICENSE_REDIRECT_HEADER,
  SUBSCRIPTION_BLOCKED_PATH,
} from "./license-redirect";

export { SKIP_LICENSE_REDIRECT_HEADER } from "./license-redirect";

// Declaración global para singleton en HMR
declare global {
  // For HMR-safe singleton in the browser
  var _axiosClient: AxiosInstance | undefined;
}

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

function createAxiosClient() {
  const instance = axios.create({
    baseURL: ENVIRONMENT.API_URL,
    headers: { "Content-Type": "application/json" },
  });

  // Interceptor: Auth
  instance.interceptors.request.use(async (config) => {
    if (typeof window === "undefined") return config;

    const session = await getClientSession();
    const token = session?.tokens?.accessToken;

    if (token) {
      if (config.headers && typeof (config.headers as { set?: unknown }).set === "function") {
        (config.headers as { set: (key: string, value: string) => void }).set(
          "Authorization",
          `Bearer ${token}`
        );
      } else {
        const headers = (config.headers = config.headers ?? {});
        (headers as Record<string, unknown>)["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  });

  // Interceptor: Agregar query params de la URL actual si es GET
  instance.interceptors.request.use((config) => {
    if (typeof window === "undefined") return config;
    if (config.method?.toLowerCase() !== "get") return config;

    const currentUrl = new URL(window.location.href);
    const currentParams = Object.fromEntries(currentUrl.searchParams.entries());

    // 🔑 Combinar params de la ruta actual con los que ya envíe el dev
    config.params = {
      ...currentParams, // primero los de la ruta actual
      ...config.params, // luego los que pases manualmente → estos tienen prioridad
    };

    return config;
  });

  // Interceptor: manejar expiración/invalidación del token en cliente
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const requestUrl = String(error?.config?.url ?? "");

      if (status === 403 && typeof window !== "undefined") {
        const data = error?.response?.data as { message?: string; error?: string } | undefined;
        const skip = readSkipHeader(error?.config?.headers);
        if (data?.message === LICENSE_BLOCKED_MESSAGE && !skip) {
          const reason = data?.error ?? "";
          const target = `${SUBSCRIPTION_BLOCKED_PATH}?reason=${encodeURIComponent(reason)}`;
          if (window.location.pathname !== SUBSCRIPTION_BLOCKED_PATH) {
            window.location.assign(target);
          }
        }
      }

      if (status === 401 && typeof window !== "undefined") {
        // Evitar loop si justo estamos intentando loguear
        if (!requestUrl.includes("/auth/login")) {
          await signOut();
          window.location.assign("/auth/login?reason=expired");
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

const w = globalThis as unknown as { _axiosClient?: AxiosInstance };
const api: AxiosInstance = w._axiosClient ?? createAxiosClient();

// Singleton para HMR
if (process.env.NODE_ENV !== "production") {
  w._axiosClient = api;
}

export default api;
