"use client";

import { Calculator, Loader2 } from "lucide-react";

import { IPriceCalculation } from "@/server/domain";
import { Skeleton } from "@/src/shared/components/ui/skeleton";
import { ChronoSeparator } from "@chrono/chrono-separator.component";

type Props = {
  priceCalculation: IPriceCalculation | null;
  loading?: boolean;
  hasFetched?: boolean;
  monthsCount: number;
  className?: string;
};

export function PriceCalculationCard({
  priceCalculation,
  loading,
  hasFetched,
  monthsCount,
  className,
}: Props) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={className}>
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">Cálculo de Precio</h4>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : null}
        </div>

        {!hasFetched ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-10" />
            </div>

            <Skeleton className="my-2 h-px w-full" />

            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>

            <Skeleton className="my-2 h-px w-full" />

            <div className="flex justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="mt-2 h-3 w-44" />
          </div>
        ) : null}

        {priceCalculation ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio del plan:</span>
              <span>{formatPrice(priceCalculation.planPrice)}</span>
            </div>

            {priceCalculation.proratedDays && priceCalculation.proratedDays > 0 ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Días prorrateados ({priceCalculation.proratedDays}):
                </span>
                <span>{formatPrice(priceCalculation.proratedAmount || 0)}</span>
              </div>
            ) : null}

            <div className="flex justify-between">
              <span className="text-muted-foreground">Meses:</span>
              <span>x{monthsCount}</span>
            </div>

            <ChronoSeparator className="my-2" />

            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto original:</span>
              <span>
                {formatPrice(
                  priceCalculation.originalAmount ?? priceCalculation.totalAmount
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Descuento:</span>
              <span>
                {(priceCalculation.discountApplied ?? 0) > 0
                  ? `-${formatPrice(priceCalculation.discountApplied ?? 0)}`
                  : "Sin descuento"}
              </span>
            </div>

            <ChronoSeparator className="my-2" />

            <div className="flex justify-between text-base font-semibold text-primary">
              <span>Total a pagar:</span>
              <span>{formatPrice(priceCalculation.totalAmount)}</span>
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              Período: {`${priceCalculation.periodStart}`} - {`${priceCalculation.periodEnd}`}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
