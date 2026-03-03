"use client";

import { createContext, useContext, useMemo, type PropsWithChildren } from "react";
import type { AppAction } from "@/src/shared/enums/auth/permissions.enum";

type PermissionsContextValue = {
  /** Set de acciones para búsqueda O(1) */
  actions: Set<string>;
  /** ¿Tiene esta acción? */
  can: (action: AppAction | string) => boolean;
  /** ¿Tiene todas estas acciones? */
  canAll: (list: (AppAction | string)[]) => boolean;
  /** ¿Tiene al menos una de estas acciones? */
  canAny: (list: (AppAction | string)[]) => boolean;
};

const PermissionsContext = createContext<PermissionsContextValue>({
  actions: new Set(),
  can: () => false,
  canAll: () => false,
  canAny: () => false,
});

/**
 * Provider que recibe las acciones del usuario (desde el server layout)
 * y las expone via contexto a todos los componentes hijos.
 */
export function PermissionsProvider({
  actions: actionList,
  children,
}: PropsWithChildren<{ actions: string[] }>) {
  const value = useMemo<PermissionsContextValue>(() => {
    const set = new Set(actionList);
    return {
      actions: set,
      can: (action) => set.has(action),
      canAll: (list) => list.every((a) => set.has(a)),
      canAny: (list) => list.some((a) => set.has(a)),
    };
  }, [actionList]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

/**
 * Hook para acceder a los permisos del usuario desde cualquier componente cliente.
 */
export function usePermissionsContext(): PermissionsContextValue {
  return useContext(PermissionsContext);
}
