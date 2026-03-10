"use client";

import { useRef } from "react";
import { useAuthStore } from "@/src/shared/stores/auth.store";

type Props = {
  actions: string[];
};

/**
 * Componente que sincroniza datos del server (cookie) al Zustand auth store.
 * Se ejecuta de forma síncrona en el primer render para que los permisos
 * estén disponibles inmediatamente, sin esperar hidratación de localStorage.
 */
export function AuthStoreInitializer({ actions }: Props) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useAuthStore.getState().setActions(actions);
    initialized.current = true;
  }

  return null;
}
