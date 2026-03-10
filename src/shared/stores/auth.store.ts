"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { SessionApplication } from "@/src/shared/types/auth/session.type";

type AuthState = {
  applications: SessionApplication[];
  actions: string[];
  _hasHydrated: boolean;
};

type AuthActions = {
  setApplications: (applications: SessionApplication[]) => void;
  setActions: (actions: string[]) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      applications: [],
      actions: [],
      _hasHydrated: false,

      setApplications: (applications) => set({ applications }),
      setActions: (actions) => set({ actions }),
      clearAuth: () => set({ applications: [], actions: [] }),
      setHasHydrated: (value) => set({ _hasHydrated: value }),
    }),
    {
      name: "chrono-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        applications: state.applications,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
