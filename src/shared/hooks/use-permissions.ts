"use client";

import { usePermissionsContext } from "@/src/shared/context/permissions.context";

/**
 * Hook del lado del cliente para verificar permisos de forma imperativa.
 * Delegado al PermissionsContext (alimentado desde el server layout).
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
  return usePermissionsContext();
}
