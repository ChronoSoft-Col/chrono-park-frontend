"use client";

import { ChronoSidebarProvider } from "@chrono/chrono-sidebar.component";
import { CommonProvider } from "@/src/shared/context/common.context";
import { HeaderProvider } from "@/src/shared/context/header.context";
import { PaymentProvider } from "@/src/shared/context/payment.context";
import { PropsWithChildren } from "react";

export default function ParkingProviders({ children }: PropsWithChildren) {
  return (
    <HeaderProvider>
      <PaymentProvider>
        <CommonProvider>
          <ChronoSidebarProvider>{children}</ChronoSidebarProvider>
        </CommonProvider>
      </PaymentProvider>
    </HeaderProvider>
  );
}
