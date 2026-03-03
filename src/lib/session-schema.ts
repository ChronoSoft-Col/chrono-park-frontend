import type { SessionMeta } from "@/src/lib/session-manager";
import type {
  CreateSessionInput,
  SessionPayload,
  SessionTokens,
  SessionPermission,
  SessionApplicationPermission,
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
 * Extrae los permisos de las aplicaciones del backend.
 * Recorre applications → resources → actions y subresources → action
 * para construir una estructura organizada + un array plano para búsqueda rápida.
 */
export function buildPermissionsFromApplications(
  applications: TApplication[]
): SessionPermission {
  const allActions: string[] = [];
  const appPermissions: SessionApplicationPermission[] = [];

  for (const app of applications) {
    const resourcePermissions = [];

    for (const resource of app.resources ?? []) {
      const resourceActions: string[] = [];

      // Acciones directas del recurso
      for (const action of resource.actions ?? []) {
        if (action && !resourceActions.includes(action)) {
          resourceActions.push(action);
        }
      }

      // Acciones dentro de sub-recursos
      for (const sub of resource.subresources ?? []) {
        for (const action of sub.action ?? []) {
          if (action && !resourceActions.includes(action)) {
            resourceActions.push(action);
          }
        }
      }

      if (resourceActions.length > 0) {
        resourcePermissions.push({
          resourceId: resource.id,
          resourceName: resource.name,
          actions: resourceActions,
        });

        // Agregar al array plano (sin duplicados)
        for (const a of resourceActions) {
          if (!allActions.includes(a)) {
            allActions.push(a);
          }
        }
      }
    }

    if (resourcePermissions.length > 0) {
      appPermissions.push({
        applicationId: app.id,
        applicationName: app.name,
        resources: resourcePermissions,
      });
    }
  }

  return {
    actions: allActions,
    applications: appPermissions,
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

  const applications = normalizeApplications(payload.applications);

  return {
    ...payload,
    tokens: normalizeTokens(payload.tokens),
    permissions: payload.permissions ?? buildPermissionsFromApplications(applications),
    applications,
    metadata,
  };
}

export function buildSessionPayload(
  input: CreateSessionInput,
  meta: SessionMeta
): SessionPayload {
  const applications = normalizeApplications(input.applications ?? input.user?.applications);
  const permissions = input.permissions ?? buildPermissionsFromApplications(applications);

  return ensureSessionPayload(
    {
      user: input.user,
      permissions,
      tokens: normalizeTokens(input.tokens),
      role: input.role ?? (input.user?.role as { id: string; name: string } | null) ?? null,
      applications,
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
