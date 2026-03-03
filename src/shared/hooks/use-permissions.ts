"use client";

import { useClientSession } from "@/src/lib/session-client";
import type { AppAction } from "@/src/shared/enums/auth/permissions.enum";
import {
  getSessionActions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "@/src/shared/utils/permissions.util";
import { useMemo } from "react";

/**
 * Hook del lado del cliente para verificar permisos de forma imperativa.
 *
 * @example
 * ```tsx
 * const { can, canAll, canAny } = usePermissions();
 *
 * if (can(ClientesAction.EDITAR_CLIENTE)) {
 *   // mostrar botón de editar
 * }
 * ```
 */
export function usePermissions() {
  const { data: session, isLoading } = useClientSession();

  const actions = useMemo(() => getSessionActions(session), [session]);

  /** ¿Tiene esta acción? */
  const can = (action: AppAction | string): boolean =>
    hasPermission(session, action);

  /** ¿Tiene todas estas acciones? */
  const canAll = (list: (AppAction | string)[]): boolean =>
    hasAllPermissions(session, list);

  /** ¿Tiene al menos una de estas acciones? */
  const canAny = (list: (AppAction | string)[]): boolean =>
    hasAnyPermission(session, list);

  return { can, canAll, canAny, actions, isLoading };
}
