import type { SessionPayload } from "@/src/shared/types/auth/session.type";
import type { AppAction } from "@/src/shared/enums/auth/permissions.enum";

/**
 * Obtiene el array plano de acciones desde `session.permissions.actions`.
 * Ya viene pre-calculado al crear la sesión.
 */
export function getSessionActions(session: SessionPayload | null): Set<string> {
  if (!session?.permissions?.actions) {
    return new Set<string>();
  }

  return new Set(session.permissions.actions);
}

/**
 * Verifica si la sesión del usuario tiene una acción específica.
 */
export function hasPermission(
  session: SessionPayload | null,
  action: AppAction | string,
): boolean {
  return session?.permissions?.actions?.includes(action) ?? false;
}

/**
 * Verifica si la sesión del usuario tiene TODAS las acciones indicadas.
 */
export function hasAllPermissions(
  session: SessionPayload | null,
  actions: (AppAction | string)[],
): boolean {
  const userActions = session?.permissions?.actions;
  if (!userActions) return false;
  return actions.every((a) => userActions.includes(a));
}

/**
 * Verifica si la sesión del usuario tiene AL MENOS UNA de las acciones indicadas.
 */
export function hasAnyPermission(
  session: SessionPayload | null,
  actions: (AppAction | string)[],
): boolean {
  const userActions = session?.permissions?.actions;
  if (!userActions) return false;
  return actions.some((a) => userActions.includes(a));
}

/**
 * Obtiene las acciones de un recurso específico dentro de una aplicación.
 */
export function getResourceActions(
  session: SessionPayload | null,
  applicationName: string,
  resourceName: string,
): string[] {
  if (!session?.permissions?.applications) return [];

  const app = session.permissions.applications.find(
    (a) => a.applicationName === applicationName,
  );
  if (!app) return [];

  const resource = app.resources.find(
    (r) => r.resourceName === resourceName,
  );

  return resource?.actions ?? [];
}
