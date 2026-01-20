"use client";
import { useChronoSidebar } from "@chrono/chrono-sidebar.component";
import { ThemeSwitcher } from "./theme-switcher.component";

export default function FooterComponent() {
  const { open, isMobile } = useChronoSidebar();

  return (
    <footer
      className={`mt-auto hover:bg-muted ${isMobile ? "bg-muted" : "bg-muted/50"} fixed bottom-0 left-0 w-full py-4 px-4 border-t border-t-border transition-all duration-200 ease-linear`}
      style={{
        paddingLeft: open && !isMobile
          ? "var(--sidebar-width)"
          : isMobile
          ? "0px"
          : "var(--sidebar-width-icon)",
      }}
    >
      <p className="text-center text-sm mb-0 text-muted-foreground">
        &copy; {new Date().getFullYear()} Chronosoft. Todos los derechos reservados.
      </p>
      <ThemeSwitcher className="absolute right-4 bottom-2" />
    </footer>
  );
}
