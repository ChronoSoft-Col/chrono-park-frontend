"use client";

import type { SessionPayload } from "@/src/shared/types/auth/session.type";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/src/shared/stores/auth.store";

let cachedSession: SessionPayload | null = null;
let lastFetch = 0;
let pendingFetch: Promise<SessionPayload | null> | null = null;
const CACHE_TTL = 30 * 1000; // 30 seconds

const SESSION_ENDPOINT = "/api-cs/session";

function shouldReuseCache(): boolean {
  if (!cachedSession) {
    return false;
  }

  return Date.now() - lastFetch < CACHE_TTL;
}

function setCache(session: SessionPayload | null) {
  cachedSession = session;
  lastFetch = Date.now();
}

export function clearSessionCache() {
  cachedSession = null;
  lastFetch = 0;
  pendingFetch = null;
}

async function fetchSessionFromServer(): Promise<SessionPayload | null> {
  try {
    const response = await fetch(SESSION_ENDPOINT, {
      method: "GET",
      cache: "no-store",
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as SessionPayload | null;
    return data ?? null;
  } catch (error) {
    console.error("No se pudo obtener la sesión del servidor", error);
    return null;
  }
}

export async function getClientSession(forceRefresh = false): Promise<SessionPayload | null> {
  if (!forceRefresh && shouldReuseCache()) {
    return cachedSession;
  }

  if (!forceRefresh && pendingFetch) {
    return pendingFetch;
  }

  const fetchPromise = fetchSessionFromServer().then((session) => {
    setCache(session);
    pendingFetch = null;
    return session;
  });

  pendingFetch = fetchPromise;
  return fetchPromise;
}

export async function signOut(): Promise<void> {
  try {
    await fetch(SESSION_ENDPOINT, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error("No se pudo cerrar la sesión", error);
  } finally {
    clearSessionCache();
    useAuthStore.getState().clearAuth();
  }
}

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type UseClientSessionOptions = {
  refreshInterval?: number;
  forceRefreshOnMount?: boolean;
};

type UseClientSessionResult = {
  data: SessionPayload | null;
  status: SessionStatus;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: (force?: boolean) => Promise<SessionPayload | null>;
};

export function useClientSession(options?: UseClientSessionOptions): UseClientSessionResult {
  const { refreshInterval, forceRefreshOnMount } = options ?? {};
  const [session, setSession] = useState<SessionPayload | null>(() => cachedSession);
  const [status, setStatus] = useState<SessionStatus>(() =>
    cachedSession ? "authenticated" : "loading",
  );
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const updateState = useCallback((nextSession: SessionPayload | null) => {
    if (!mountedRef.current) {
      return;
    }

    setSession(nextSession);
    setStatus(nextSession ? "authenticated" : "unauthenticated");
  }, []);

  const refresh = useCallback(
    async (force = true) => {
      setStatus((previous) => (previous === "loading" ? previous : "loading"));
      const value = await getClientSession(force);
      updateState(value);
      return value;
    },
    [updateState]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refresh(forceRefreshOnMount ?? false).catch((error) => {
        console.error("No se pudo obtener la sesión inicial", error);
      });
    }, 0);

    if (!refreshInterval || refreshInterval <= 0) {
      return () => {
        clearTimeout(timeoutId);
      };
    }

    const intervalId = setInterval(() => {
      refresh(true).catch((error) => {
        console.error("No se pudo refrescar la sesión", error);
      });
    }, refreshInterval);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [forceRefreshOnMount, refreshInterval, refresh]);

  return {
    data: session,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    refresh,
  };
}
