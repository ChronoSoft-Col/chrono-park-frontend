"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { DialogProvider } from "@/src/shared/context/dialog.context";
import { CommonProvider } from "@/src/shared/context/common.context";

export default function RootProviders({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <CommonProvider>
        <DialogProvider>
          {children}
        </DialogProvider>
      </CommonProvider>
    </NextThemesProvider>
  );
}
