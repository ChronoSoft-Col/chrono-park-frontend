import { ShieldX } from "lucide-react";

export type PermissionTableActionsFallbackProps = {
  /** Mensaje personalizado (por defecto: "Sin permisos") */
  message?: string;
  /** Número de columnas que ocupa la celda (para colSpan si se usa dentro de <td>) */
  colSpan?: number;
};

/**
 * Fallback para la columna de acciones de una tabla cuando el usuario
 * no tiene permisos sobre ninguna acción de la fila.
 *
 * Se usa como `fallback` en un `PermissionGuard` que envuelva toda la celda de acciones,
 * o individualmente por cada botón.
 *
 * @example
 * ```tsx
 * // Envolver toda la celda de acciones
 * <PermissionGuard
 *   actions={[ClientesAction.EDITAR_CLIENTE, ClientesAction.ELIMINAR_CLIENTE]}
 *   mode="some"
 *   fallback={<PermissionTableActionsFallback />}
 * >
 *   <div className="flex gap-2">
 *     <BotonEditar />
 *     <BotonEliminar />
 *   </div>
 * </PermissionGuard>
 *
 * // O como placeholder inline
 * <PermissionTableActionsFallback message="Acciones restringidas" />
 * ```
 */
export function PermissionTableActionsFallback({
  message = "Sin permisos",
}: PermissionTableActionsFallbackProps) {
  return (
    <div className="flex items-center justify-end gap-1.5 text-muted-foreground/60">
      <ShieldX className="h-3.5 w-3.5" />
      <span className="text-xs italic">{message}</span>
    </div>
  );
}
