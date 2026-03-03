import type { SessionPayload } from "@/src/shared/types/auth/session.type";
import type { AppAction } from "@/src/shared/enums/auth/permissions.enum";

/**
 * Extrae todas las acciones (strings) de la sesión del usuario.
 * Recorre `applications → resources → actions` y `subresources → action`.
 */
export function getSessionActions(session: SessionPayload | null): Set<string> {
  const actions = new Set<string>();

  if (!session?.applications) {
    return actions;
  }

  for (const app of session.applications) {
    for (const resource of app.resources ?? []) {
      // Acciones directas del recurso
      for (const action of resource.actions ?? []) {
        if (action.name) {
          actions.add(action.name);
        }
      }

      // Acciones dentro de sub-recursos
      for (const sub of resource.subresources ?? []) {
        if (sub.action?.name) {
          actions.add(sub.action.name);
        }
      }
    }
  }

  return actions;
}

/**
 * Verifica si la sesión del usuario tiene una acción específica.
 */
export function hasPermission(
  session: SessionPayload | null,
  action: AppAction | string,
): boolean {
  return getSessionActions(session).has(action);
}

/**
 * Verifica si la sesión del usuario tiene TODAS las acciones indicadas.
 */
export function hasAllPermissions(
  session: SessionPayload | null,
  actions: (AppAction | string)[],
): boolean {
  const userActions = getSessionActions(session);
  return actions.every((a) => userActions.has(a));
}

/**
 * Verifica si la sesión del usuario tiene AL MENOS UNA de las acciones indicadas.
 */
export function hasAnyPermission(
  session: SessionPayload | null,
  actions: (AppAction | string)[],
): boolean {
  const userActions = getSessionActions(session);
  return actions.some((a) => userActions.has(a));
}
