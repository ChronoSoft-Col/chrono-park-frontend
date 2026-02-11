import HeaderComponent from "@/src/shared/components/layout/header.component";
import SidebarComponent from "@/src/shared/components/layout/sidebar.component";
import { ChronoSidebarInset } from "@chrono/chrono-sidebar.component";
import { PropsWithChildren } from "react";
import { getSession } from "@/src/lib/session";
import FooterComponent from "@/src/shared/components/layout/footer.component";
import ParkingProviders from "./providers";

export default async function ParkingLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  const applications = session?.applications ?? [];

  return (
    <ParkingProviders>
      <SidebarComponent applications={applications} />
      <ChronoSidebarInset className="min-w-0 overflow-hidden grid grid-rows-[auto_1fr_auto] h-screen p-0">
        <HeaderComponent />
        <main className="overflow-y-auto overflow-x-hidden px-4 sm:px-6 md:px-8">
          <section className="max-w-full mx-auto w-full h-full">{children}</section>
        </main>
        <FooterComponent />
      </ChronoSidebarInset>
    </ParkingProviders>
  );
}
