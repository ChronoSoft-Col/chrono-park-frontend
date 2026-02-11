"use client";
import { useChronoSidebar } from "@chrono/chrono-sidebar.component";
import { ThemeSwitcher } from "./theme-switcher.component";

export default function FooterComponent() {
  const { isMobile } = useChronoSidebar();

  return (
    <footer
      className={`shrink-0 hover:bg-muted ${isMobile ? "bg-muted" : "bg-muted/50"} py-4 px-4 border-t border-t-border relative`}
    >
      <p className="text-center text-sm mb-0 text-muted-foreground">
        &copy; {new Date().getFullYear()} Chronosoft. Todos los derechos reservados.
      </p>
      <ThemeSwitcher className="absolute right-4 bottom-2" />
    </footer>
  );
}
