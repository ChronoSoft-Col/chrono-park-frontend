"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { usePathname, useRouter } from "next/navigation";
import { ChronoInput } from "@chrono/chrono-input.component";
import ChronoButton from "@chrono/chrono-button.component";
import { useChronoSidebar } from "@chrono/chrono-sidebar.component";
import { ENVIRONMENT } from "../../constants/environment";

export default function SearchComponent() {
  const pathname = usePathname();
  const { replace } = useRouter();
  const { isMobile } = useChronoSidebar();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  
  const [debouncedSearchTerm] = useDebounce(searchTerm, ENVIRONMENT.DEBOUNCE_TIME);

  useEffect(() => {
    const setUrlParam = (value: string) => {
      const currentUrl = pathname + window.location.search;
      const url = new URL(window.location.href);
      const normalizedValue = value.trim();

      if (!normalizedValue) {
        if (!url.searchParams.has("search")) {
          return;
        }
        url.searchParams.delete("search");
      } else {
        const currentSearch = url.searchParams.get("search") ?? "";
        if (currentSearch === normalizedValue) {
          return;
        }
        url.searchParams.set("search", normalizedValue);
        url.searchParams.delete("page");
      }

      const nextUrl = url.pathname + url.search;
      if (nextUrl !== currentUrl) {
        replace(nextUrl);
      }
    };

    setUrlParam(debouncedSearchTerm);
  }, [debouncedSearchTerm, pathname, replace]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (isMobile) {
    return (
      <div className="flex items-center justify-end gap-2 w-full">
        {!isOpen ? (
          <ChronoButton
            variant="outline"
            size="icon-sm"
            aria-label="Abrir búsqueda"
            onClick={() => setIsOpen(true)}
          >
            <Search className="w-5 h-5" />
          </ChronoButton>
        ) : (
          <div className="flex w-full items-center gap-2">
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
            <ChronoInput
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full"
              clearable
            />
            <ChronoButton
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Cerrar búsqueda"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </ChronoButton>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
  <Search className="ml-3 h-4 w-4 text-muted-foreground" />
      <ChronoInput
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar..."
        className="max-w-sm"
        clearable
      />
    </div>
  );
}
