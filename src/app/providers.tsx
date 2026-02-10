"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { DialogProvider } from "@/src/shared/context/dialog.context";

export default function RootProviders({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <DialogProvider>
        {children}
      </DialogProvider>
    </NextThemesProvider>
  );
}
