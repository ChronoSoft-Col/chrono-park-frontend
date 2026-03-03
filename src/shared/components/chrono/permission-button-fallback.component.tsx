import { ShieldX } from "lucide-react";

export type PermissionButtonFallbackProps = {
  /** Texto opcional que describe la acción restringida */
  label?: string;
};

/**
 * Fallback para botones protegidos por permisos.
 * Muestra un botón deshabilitado con icono de escudo y tooltip visual.
 *
 * @example
 * ```tsx
 * <PermissionGuard
 *   action={ClientesAction.CREAR_CLIENTE}
 *   fallback={<PermissionButtonFallback label="Crear cliente" />}
 * >
 *   <ChronoButton onClick={handleCreate}>Crear cliente</ChronoButton>
 * </PermissionGuard>
 * ```
 */
export function PermissionButtonFallback({ label }: PermissionButtonFallbackProps) {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/50 px-3 py-2 text-xs text-muted-foreground cursor-not-allowed opacity-60"
      title={label ? `Sin permiso: ${label}` : "Sin permiso para esta acción"}
    >
      <ShieldX className="h-3.5 w-3.5" />
      {label && <span>{label}</span>}
    </button>
  );
}
