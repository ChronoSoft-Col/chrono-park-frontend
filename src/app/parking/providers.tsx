"use client";

import { ChronoSidebarProvider } from "@chrono/chrono-sidebar.component";
import { HeaderProvider } from "@/src/shared/context/header.context";
import { PaymentProvider } from "@/src/shared/context/payment.context";
import { PropsWithChildren, useEffect } from "react";
import { useCommonStore } from "@/src/shared/stores/common.store";

function CommonStoreInitializer() {
  const fetchCommonData = useCommonStore((s) => s.fetchCommonData);

  useEffect(() => {
    fetchCommonData();
  }, [fetchCommonData]);

  return null;
}

export default function ParkingProviders({ children }: PropsWithChildren) {
  return (
    <HeaderProvider>
      <CommonStoreInitializer />
      <PaymentProvider>
        <ChronoSidebarProvider>{children}</ChronoSidebarProvider>
      </PaymentProvider>
    </HeaderProvider>
  );
}
