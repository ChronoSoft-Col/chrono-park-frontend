"use client";

import { ReactNode, TransitionStartFunction, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LIMIT_OPTIONS } from "@/src/shared/constants/pagination";

import { cn } from "@/src/lib/utils";
import {
  ChronoPagination,
  ChronoPaginationContent,
  ChronoPaginationEllipsis,
  ChronoPaginationItem,
  ChronoPaginationLink,
  ChronoPaginationNext,
  ChronoPaginationPrevious,
} from "./chrono-pagination.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "./chrono-select.component";

export type ChronoPaginatorProps = {
  totalPages: number;
  showLimitSelector?: boolean;
  limitOptions?: number[];
  pageParam?: string;
  limitParam?: string;
  pending?: boolean;
  withTransition?: TransitionStartFunction;
  limitLabel?: ReactNode;
  className?: string;
};

export function ChronoPaginator({
  totalPages,
  showLimitSelector = true,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
  pageParam = "page",
  limitParam = "limit",
  pending: liftedPending,
  withTransition,
  limitLabel = "Registros por página:",
  className,
}: ChronoPaginatorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [localPending, localStartTransition] = useTransition();
  const pending = typeof liftedPending === "boolean" ? liftedPending : localPending;
  const startTransition = withTransition ?? localStartTransition;

  const safeTotalPages = Math.max(1, Number.isFinite(totalPages) ? totalPages : 1);
  const fallbackLimit = limitOptions[0] ?? DEFAULT_LIMIT_OPTIONS[1];

  const currentPage = useMemo(() => {
    const raw = Number(searchParams.get(pageParam) ?? "1");
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(raw, safeTotalPages);
  }, [pageParam, safeTotalPages, searchParams]);

  const currentLimit = useMemo(() => {
    const raw = Number(searchParams.get(limitParam) ?? String(fallbackLimit));
    if (!Number.isFinite(raw) || raw <= 0) return fallbackLimit;
    return raw;
  }, [fallbackLimit, limitParam, searchParams]);

  const buildUrl = (nextParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(nextParams).forEach(([key, value]) => params.set(key, value));
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const goToPage = (page: number) => {
    if (pending || page === currentPage) return;
    startTransition(() => {
      router.push(buildUrl({ [pageParam]: String(page) }));
    });
  };

  const goPrev = () => {
    if (currentPage > 1) goToPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < safeTotalPages) goToPage(currentPage + 1);
  };

  const handleLimitChange = (value: string) => {
    if (pending || value === String(currentLimit)) return;
    startTransition(() => {
      router.replace(
        buildUrl({
          [limitParam]: value,
          [pageParam]: "1",
        }),
      );
    });
  };

  const pages = useMemo(() => {
    if (safeTotalPages <= 7) {
      return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
    }

    type RangePiece = number | "ellipsis-left" | "ellipsis-right";
    const range: RangePiece[] = [];
    const add = (value: number) => range.push(value);
    const windowStart = Math.max(2, currentPage - 1);
    const windowEnd = Math.min(safeTotalPages - 1, currentPage + 1);

    add(1);
    if (windowStart > 2) range.push("ellipsis-left");
    for (let page = windowStart; page <= windowEnd; page += 1) add(page);
    if (windowEnd < safeTotalPages - 1) range.push("ellipsis-right");
    add(safeTotalPages);

    return range;
  }, [currentPage, safeTotalPages]);

  return (
    <div
      className={cn("flex w-full flex-col gap-4 p-4 xl:flex-row xl:items-center xl:justify-between", className)}
    >
      <div className="flex w-full justify-center xl:w-auto xl:justify-start">
        <ChronoPagination aria-busy={pending} data-pending={pending ? "true" : "false"} className="flex">
          <ChronoPaginationContent
            className="transition-opacity duration-200 data-[pending=true]:pointer-events-none data-[pending=true]:opacity-50"
            data-pending={pending ? "true" : "false"}
          >
            <ChronoPaginationItem>
              <ChronoPaginationPrevious
                href={buildUrl({ [pageParam]: String(Math.max(1, currentPage - 1)) })}
                onClick={(event) => {
                  event.preventDefault();
                  goPrev();
                }}
                aria-disabled={pending || currentPage === 1}
                className={cn({ "pointer-events-none opacity-50": pending || currentPage === 1 })}
              />
            </ChronoPaginationItem>

            {pages.map((page, index) => {
              if (page === "ellipsis-left" || page === "ellipsis-right") {
                return <ChronoPaginationEllipsis key={`${page}-${index}`} />;
              }

              const pageNumber = page as number;
              const isActive = pageNumber === currentPage;

              return (
                <ChronoPaginationItem key={pageNumber}>
                  <ChronoPaginationLink
                    href={buildUrl({ [pageParam]: String(pageNumber) })}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(pageNumber);
                    }}
                    isActive={isActive}
                    aria-disabled={pending}
                    className="transition-transform duration-150 data-[active=true]:scale-105 data-[active=false]:opacity-70"
                  >
                    {pageNumber}
                  </ChronoPaginationLink>
                </ChronoPaginationItem>
              );
            })}

            <ChronoPaginationItem>
              <ChronoPaginationNext
                href={buildUrl({
                  [pageParam]: String(Math.min(safeTotalPages, currentPage + 1)),
                })}
                onClick={(event) => {
                  event.preventDefault();
                  goNext();
                }}
                aria-disabled={pending || currentPage === safeTotalPages}
                className={cn({ "pointer-events-none opacity-50": pending || currentPage === safeTotalPages })}
              />
            </ChronoPaginationItem>
          </ChronoPaginationContent>
        </ChronoPagination>
      </div>

      {showLimitSelector && limitOptions.length > 0 && (
        <div className="flex w-full items-center justify-center gap-2 xl:w-auto xl:justify-end">
          <span className="text-xs text-muted-foreground">{limitLabel}</span>
          <ChronoSelect value={String(currentLimit)} onValueChange={handleLimitChange} disabled={pending}>
            <ChronoSelectTrigger className="w-24">
              <ChronoSelectValue placeholder={String(currentLimit)} />
            </ChronoSelectTrigger>
            <ChronoSelectContent>
              {limitOptions.map((option) => (
                <ChronoSelectItem key={option} value={String(option)}>
                  {option}
                </ChronoSelectItem>
              ))}
            </ChronoSelectContent>
          </ChronoSelect>
        </div>
      )}
    </div>
  );
}
