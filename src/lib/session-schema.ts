import type { SessionMeta } from "@/src/lib/session-manager";
import type {
  CreateSessionInput,
  SessionApplication,
  SessionPayload,
  SessionTokens,
  SessionPermission,
  SessionMetadata,
} from "@/src/shared/types/auth/session.type";
import type { TApplication } from "@/src/shared/types/auth/application.type";

export function normalizeTokens(
  tokens: SessionTokens | Record<string, unknown> | undefined
): SessionTokens {
  const candidate = (tokens ?? {}) as Record<string, unknown>;

  const accessToken =
    (candidate["accessToken"] as string | undefined) ??
    (candidate["access_token"] as string | undefined) ??
    "";

  const refreshToken =
    (candidate["refreshToken"] as string | undefined) ??
    (candidate["refresh_token"] as string | undefined) ??
    undefined;

  return {
    accessToken,
    refreshToken,
  };
}

export function normalizeApplications(apps?: unknown): TApplication[] {
  if (!Array.isArray(apps)) return [];
  return apps as TApplication[];
}

/**
 * Crea una versión ligera de las aplicaciones para la cookie de sesión.
 * Elimina `actions` de recursos y `action` de subrecursos para reducir el tamaño.
 * El sidebar solo necesita: id, name, path, icon para la navegación.
 */
export function slimApplications(apps: TApplication[]): SessionApplication[] {
  return apps.map((app) => ({
    id: app.id,
    name: app.name,
    path: app.path,
    isActive: app.isActive,
    resources: (app.resources ?? []).map((res) => ({
      id: res.id,
      name: res.name,
      path: res.path,
      icon: res.icon,
      subresources: (res.subresources ?? []).map((sub) => ({
        id: sub.id,
        name: sub.name,
        path: sub.path,
        icon: sub.icon,
      })),
    })),
  }));
}

/**
 * Extrae los permisos de las aplicaciones del backend.
 * Recorre applications → resources → actions y subresources → action
 * para construir un array plano de acciones únicas.
 */
export function buildPermissionsFromApplications(
  applications: TApplication[]
): SessionPermission {
  const actionSet = new Set<string>();

  for (const app of applications) {
    for (const resource of app.resources ?? []) {
      for (const action of resource.actions ?? []) {
        if (action) actionSet.add(action);
      }

      for (const sub of resource.subresources ?? []) {
        for (const action of sub.action ?? []) {
          if (action) actionSet.add(action);
        }
      }
    }
  }

  return {
    actions: [...actionSet],
  };
}

export function ensureSessionPayload(
  payload: SessionPayload,
  meta: SessionMeta
): SessionPayload {
  const metadata: SessionMetadata = {
    ...(payload.metadata ?? {}),
    maxAge: meta.maxAge,
    issuedAt: meta.issuedAt,
    expiresAt: meta.expiresAt,
  };

  return {
    ...payload,
    tokens: normalizeTokens(payload.tokens),
    permissions: payload.permissions ?? null,
    applications: payload.applications,
    metadata,
  };
}

export function buildSessionPayload(
  input: CreateSessionInput,
  meta: SessionMeta
): SessionPayload {
  const fullApps = normalizeApplications(input.applications);
  const permissions = input.permissions ?? buildPermissionsFromApplications(fullApps);

  return ensureSessionPayload(
    {
      user: { id: input.user.id, email: input.user.email, name: input.user.name },
      permissions,
      tokens: normalizeTokens(input.tokens),
      role: input.role ?? null,
      applications: slimApplications(fullApps),
      metadata: {
        ...(input.metadata ?? {}),
        maxAge: meta.maxAge,
        issuedAt: meta.issuedAt,
        expiresAt: meta.expiresAt,
      },
    },
    meta
  );
}
