import "server-only";

import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { ResponseCookies } from "next/dist/server/web/spec-extension/cookies";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export type SessionMeta = {
  issuedAt: number;
  expiresAt: number;
  maxAge: number;
};

export type CookieAttributes = Pick<ResponseCookie, "domain" | "path" | "httpOnly" | "sameSite" | "secure" | "priority">;

export type SessionManagerConfig<TSession, TSerialized = TSession> = {
  secret: string;
  cookieName: string;
  maxAge?: number;
  cookieOptions?: Partial<CookieAttributes>;
  serialize?: (session: TSession, meta: SessionMeta) => TSerialized;
  deserialize?: (payload: TSerialized, meta: SessionMeta) => TSession;
};

export type SessionManager<TSession> = {
  create: (session: TSession, options?: { maxAge?: number }) => Promise<TSession>;
  get: () => Promise<TSession | null>;
  getFromRequest: (request: NextRequest) => TSession | null;
  update: (
    mutator: (session: TSession) => TSession,
    options?: { maxAge?: number }
  ) => Promise<TSession | null>;
  destroy: () => Promise<void>;
};

type Envelope<T> = {
  iat: number;
  exp: number;
  payload: T;
};

type ResolveResult<TSession, TSerialized> = {
  meta: SessionMeta;
  serialized: TSerialized;
  value: TSession;
};

function resolveSecretKey(secret: string): Buffer {
  if (!secret || secret.length < 16) {
    throw new Error("Session secret must be at least 16 characters long.");
  }

  return createHash("sha256").update(secret).digest();
}

function encrypt(value: string, key: Buffer): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, ciphertext]).toString("base64url");
}

function decrypt(value: string, key: Buffer): string {
  const buffer = Buffer.from(value, "base64url");
  const iv = buffer.subarray(0, IV_LENGTH);
  const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}

async function getMutableCookies(): Promise<ResponseCookies> {
  const store = await cookies();
  return store as unknown as ResponseCookies;
}

function mergeCookieOptions(
  base: Partial<CookieAttributes>,
  override?: Partial<CookieAttributes>
): Partial<CookieAttributes> {
  return {
    ...base,
    ...override,
  };
}

function resolveCookieName(name?: string): string {
  return name && name.trim().length > 0 ? name : "session";
}

function createDefaultCookieOptions(): Partial<CookieAttributes> {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export function createSessionManager<TSession, TSerialized = TSession>(
  config: SessionManagerConfig<TSession, TSerialized>
): SessionManager<TSession> {
  const secretKey = resolveSecretKey(config.secret);
  const cookieName = resolveCookieName(config.cookieName);
  const defaultMaxAge = config.maxAge ?? DEFAULT_MAX_AGE_SECONDS;
  const serializeFn =
    config.serialize ??
    ((session: TSession, meta: SessionMeta) => {
      void meta;
      return session as unknown as TSerialized;
    });
  const deserializeFn =
    config.deserialize ??
    ((payload: TSerialized, meta: SessionMeta) => {
      void meta;
      return payload as unknown as TSession;
    });
  const cookieOptions = mergeCookieOptions(createDefaultCookieOptions(), config.cookieOptions);

  const writeCookie = async (value: string, maxAge: number) => {
    const store = await getMutableCookies();
    store.set({
      name: cookieName,
      value,
      maxAge,
      ...cookieOptions,
    });
  };

  const deleteCookie = async () => {
    const store = await getMutableCookies();
    store.delete(cookieName);
  };

  const readCookie = async (): Promise<string | undefined> => {
    const store = await cookies();
    return store.get(cookieName)?.value;
  };

  const decodeEnvelope = (value?: string): Envelope<TSerialized> | null => {
    if (!value) {
      return null;
    }

    try {
      const decrypted = decrypt(value, secretKey);
      const parsed = JSON.parse(decrypted) as Envelope<TSerialized>;

      if (!parsed || typeof parsed !== "object") {
        return null;
      }

      if (typeof parsed.iat !== "number" || typeof parsed.exp !== "number") {
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Failed to decode session cookie", error);
      return null;
    }
  };

  const resolve = (envelope: Envelope<TSerialized>): ResolveResult<TSession, TSerialized> | null => {
    const lifespanMs = Math.max(0, envelope.exp - envelope.iat);
    const lifespanSeconds = Math.max(0, Math.round(lifespanMs / 1000));
    const meta: SessionMeta = {
      issuedAt: envelope.iat,
      expiresAt: envelope.exp,
      maxAge: lifespanSeconds || defaultMaxAge,
    };

    if (meta.expiresAt < Date.now()) {
      return null;
    }

    try {
      const value = deserializeFn(envelope.payload, meta);
      return { meta, serialized: envelope.payload, value };
    } catch (error) {
      console.error("Failed to deserialize session payload", error);
      return null;
    }
  };

  const encodeEnvelope = (
    session: TSession,
    meta: SessionMeta
  ): { raw: string; serialized: TSerialized } | null => {
    try {
      const serialized = serializeFn(session, meta);
      const envelope: Envelope<TSerialized> = {
        iat: meta.issuedAt,
        exp: meta.expiresAt,
        payload: serialized,
      };
      const raw = encrypt(JSON.stringify(envelope), secretKey);
      return { raw, serialized };
    } catch (error) {
      console.error("Failed to serialize session payload", error);
      return null;
    }
  };

  const manager: SessionManager<TSession> = {
    async create(session, options) {
      const maxAge = options?.maxAge ?? defaultMaxAge;
      const issuedAt = Date.now();
      const meta: SessionMeta = {
        issuedAt,
        expiresAt: issuedAt + maxAge * 1000,
        maxAge,
      };

      const encoded = encodeEnvelope(session, meta);

      if (!encoded) {
        throw new Error("Unable to serialize the session payload.");
      }

      await writeCookie(encoded.raw, maxAge);

      return deserializeFn(encoded.serialized, meta);
    },

    async get() {
      const value = await readCookie();
      const envelope = decodeEnvelope(value);
      if (!envelope) {
        return null;
      }

      const resolved = resolve(envelope);
      if (!resolved) {
        return null;
      }

      return resolved.value;
    },

    getFromRequest(request) {
      const raw = request.cookies.get(cookieName)?.value;
      const envelope = decodeEnvelope(raw);
      if (!envelope) {
        return null;
      }

      const resolved = resolve(envelope);
      return resolved?.value ?? null;
    },

    async update(mutator, options) {
      const value = await readCookie();
      const envelope = decodeEnvelope(value);
      if (!envelope) {
        return null;
      }

      const resolved = resolve(envelope);
      if (!resolved) {
        return null;
      }

      const maxAge = options?.maxAge ?? defaultMaxAge;
      const issuedAt = Date.now();
      const meta: SessionMeta = {
        issuedAt,
        expiresAt: issuedAt + maxAge * 1000,
        maxAge,
      };

      const nextSession = mutator(resolved.value);
      const encoded = encodeEnvelope(nextSession, meta);

      if (!encoded) {
        throw new Error("Unable to serialize the updated session payload.");
      }

      await writeCookie(encoded.raw, maxAge);

      return deserializeFn(encoded.serialized, meta);
    },

    async destroy() {
      await deleteCookie();
    },
  };

  return manager;
}

export const DEFAULT_SESSION_MAX_AGE_SECONDS = DEFAULT_MAX_AGE_SECONDS;
