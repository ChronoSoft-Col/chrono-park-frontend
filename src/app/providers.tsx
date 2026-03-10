"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { DialogProvider } from "@/src/shared/context/dialog.context";
import { PermissionsProvider } from "@/src/shared/context/permissions.context";

export default function RootProviders({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <PermissionsProvider>
        <DialogProvider>
          {children}
        </DialogProvider>
      </PermissionsProvider>
    </NextThemesProvider>
  );
}
