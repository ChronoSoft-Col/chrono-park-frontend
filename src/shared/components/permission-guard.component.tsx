"use client";

import { useClientSession } from "@/src/lib/session-client";
import { type AppAction } from "@/src/shared/enums/auth/permissions.enum";
import {
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "@/src/shared/utils/permissions.util";
import { ShieldX } from "lucide-react";
import type { ReactNode } from "react";

// ─── Props ───────────────────────────────────────────────────────────────────

type SingleActionProps = {
  /** Acción requerida para mostrar el contenido */
  action: AppAction | string;
  actions?: never;
  mode?: never;
};

type MultipleActionsProps = {
  action?: never;
  /** Lista de acciones a evaluar */
  actions: (AppAction | string)[];
  /**
   * - `"every"` → el usuario debe tener **todas** las acciones (por defecto).
   * - `"some"`  → basta con tener **al menos una**.
   */
  mode?: "every" | "some";
};

type PermissionGuardProps = (SingleActionProps | MultipleActionsProps) & {
  /** Contenido a mostrar si el usuario tiene el permiso */
  children: ReactNode;
  /** Componente personalizado a mostrar si NO tiene permiso */
  fallback?: ReactNode;
  /** Si es `true`, no renderiza nada cuando no tiene permiso (útil para botones) */
  hidden?: boolean;
};

// ─── Fallback por defecto ────────────────────────────────────────────────────

function DefaultFallback() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-2 py-20 text-muted-foreground">
      <ShieldX className="h-12 w-12" />
      <h2 className="text-lg font-semibold">Acceso restringido</h2>
      <p className="text-sm">
        No cuentas con los permisos necesarios para ver este contenido.
      </p>
    </div>
  );
}

// ─── Componente ──────────────────────────────────────────────────────────────

/**
 * Componente del lado del cliente que protege contenido según las acciones
 * del usuario en la sesión.
 *
 * @example
 * ```tsx
 * // Una sola acción
 * <PermissionGuard action={ClientesAction.CREAR_CLIENTE}>
 *   <BotonCrearCliente />
 * </PermissionGuard>
 *
 * // Múltiples acciones (todas requeridas)
 * <PermissionGuard actions={[ClientesAction.VER_CLIENTES, ClientesAction.EDITAR_CLIENTE]}>
 *   <FormularioEdicion />
 * </PermissionGuard>
 *
 * // Al menos una acción
 * <PermissionGuard actions={[CierresAction.VER_CIERRES, PagosAction.VER_PAGOS]} mode="some">
 *   <ResumenFinanciero />
 * </PermissionGuard>
 *
 * // Ocultar en vez de mostrar fallback (ideal para botones)
 * <PermissionGuard action={ClientesAction.ELIMINAR_CLIENTE} hidden>
 *   <BotonEliminar />
 * </PermissionGuard>
 * ```
 */
export default function PermissionGuard({
  children,
  fallback,
  hidden = false,
  ...rest
}: PermissionGuardProps) {
  const { data: session, isLoading } = useClientSession();

  // Mientras carga la sesión no renderizamos nada
  if (isLoading) {
    return null;
  }

  // Evaluar permisos
  let allowed = false;

  if ("action" in rest && rest.action) {
    allowed = hasPermission(session, rest.action);
  } else if ("actions" in rest && rest.actions) {
    const mode = rest.mode ?? "every";
    allowed =
      mode === "every"
        ? hasAllPermissions(session, rest.actions)
        : hasAnyPermission(session, rest.actions);
  }

  if (allowed) {
    return <>{children}</>;
  }

  if (hidden) {
    return null;
  }

  return <>{fallback ?? <DefaultFallback />}</>;
}
