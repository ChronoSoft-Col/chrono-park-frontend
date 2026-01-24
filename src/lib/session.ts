import "server-only";

import type { NextRequest } from "next/server";

import { ENVIRONMENT } from "@/src/shared/constants/environment";
import type {
  CreateSessionInput,
  SessionPayload,
} from "@/src/shared/types/auth/session.type";

import {
  createSessionManager,
  DEFAULT_SESSION_MAX_AGE_SECONDS,
  type SessionMeta,
} from "./session-manager";
import { buildSessionPayload, ensureSessionPayload } from "./session-schema";

const SESSION_SECRET = ENVIRONMENT.SESSION_SECRET;

if (!SESSION_SECRET || SESSION_SECRET.length < 16) {
  throw new Error(
    "SESSION_SECRET (or AUTH_SECRET) must be defined and at least 16 characters long.",
  );
}

const DEFAULT_MAX_AGE = Number.isFinite(ENVIRONMENT.SESSION_MAX_AGE)
  ? Number(ENVIRONMENT.SESSION_MAX_AGE)
  : DEFAULT_SESSION_MAX_AGE_SECONDS;

const sessionManager = createSessionManager<SessionPayload>({
  secret: SESSION_SECRET,
  cookieName: ENVIRONMENT.SESSION_COOKIE_NAME || "chrono_session",
  maxAge: DEFAULT_MAX_AGE,
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: ENVIRONMENT.COOKIE_SECURE === "true",
    path: "/",
  },
  serialize: (payload, meta) => ensureSessionPayload(payload, meta),
  deserialize: (value, meta) =>
    ensureSessionPayload(value as SessionPayload, meta),
});

function createSessionMeta(maxAge: number): SessionMeta {
  const issuedAt = Date.now();
  return {
    issuedAt,
    expiresAt: issuedAt + maxAge * 1000,
    maxAge,
  };
}

export async function createSession(
  input: CreateSessionInput,
): Promise<SessionPayload> {
  const maxAge = input.maxAge ?? DEFAULT_MAX_AGE;
  const meta = createSessionMeta(maxAge);
  const payload = buildSessionPayload(input, meta);

  return sessionManager.create(payload, { maxAge });
}

export function getSession(): Promise<SessionPayload | null> {
  return sessionManager.get();
}

export function getSessionFromRequest(
  request: NextRequest,
): SessionPayload | null {
  return sessionManager.getFromRequest(request);
}

export function updateSession(
  mutator: (session: SessionPayload) => SessionPayload,
  options?: { maxAge?: number },
): Promise<SessionPayload | null> {
  const maxAge = options?.maxAge ?? DEFAULT_MAX_AGE;

  return sessionManager.update(
    (current) =>
      mutator({
        ...current,
        metadata: {
          ...current.metadata,
        },
      }),
    { maxAge },
  );
}

export function destroySession(): Promise<void> {
  return sessionManager.destroy();
}
