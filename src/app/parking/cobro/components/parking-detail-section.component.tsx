"use client";

import EmptyState from "@/src/shared/components/empty-state.component";
import { usePaymentContext } from "@/src/shared/context/payment.context";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import type { IAmountDetailEntity } from "@/server/domain";
import LabelValueComponent from "@/src/app/parking/cobro/components/label-value.component";
import {
    ChronoCard,
    ChronoCardContent,
    ChronoCardHeader,
    ChronoCardTitle,
} from "@chrono/chrono-card.component";
import { CalendarClock, Clock8, TimerReset, Wallet2, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
});

const shortDateFormatter = new Intl.DateTimeFormat("es-CO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
});

const formatCurrency = (value: number) => currencyFormatter.format(value ?? 0);

const getDateParts = (value: Date | string) => {
    const date = new Date(value);
    return {
        dateLabel: shortDateFormatter.format(date),
        timeLabel: timeFormatter.format(date),
    };
};

type QrDetailSectionProps = {
    className?: string;
};

type QrAmountDetail = Pick<
    IAmountDetailEntity,
    | "entryTime"
    | "exitTime"
    | "durationMinutes"
    | "durationFormatted"
    | "calculatedAmount"
    | "discountPercentage"
    | "finalAmount"
    | "rateProfileName"
    | "agreementName"
    | "appliedRules"
    | "gracePeriodMinutes"
>;

export function QrDetailSectionComponent({ className }: QrDetailSectionProps) {
    const { validateRaw } = usePaymentContext();

    const detail: QrAmountDetail | null = validateRaw?.data ?? null;

    if (!detail) {
        return (
            <section className={cn("flex h-full min-w-0 flex-col overflow-y-auto pr-1", className)}>
                <div className="flex flex-1 items-center justify-center px-4">
                    <EmptyState
                        title="No hay datos registrados"
                        description="Intenta leer un QR para visualizar sus datos"
                        icon={<X />}
                    />
                </div>
            </section>
        );
    }

    const entry = getDateParts(detail.entryTime);
    const exit = getDateParts(detail.exitTime);
    const discount = detail.discountPercentage ?? 0;
    const rules = detail.appliedRules ?? [];
    const visibleRules = rules.slice(0, 4);
    const hiddenRules = Math.max(rules.length - visibleRules.length, 0);

    return (
        <div className={cn("flex min-w-0 flex-col gap-2 overflow-y-auto pr-1 py-2 lg:my-auto animate-in fade-in duration-500", className)}>
            <ChronoCard className="bg-card/95 h-min">
                <ChronoCardHeader className="gap-2">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <ChronoSectionLabel size="base">
                                Perfil de tarifa
                            </ChronoSectionLabel>
                            <ChronoValue size="md">
                                {detail.rateProfileName}
                            </ChronoValue>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {detail.agreementName && (
                                <ChronoBadge className="border border-primary/30 bg-primary/10 text-xs text-foreground">
                                    {detail.agreementName}
                                </ChronoBadge>
                            )}
                        </div>
                    </div>
                </ChronoCardHeader>

                <ChronoCardContent className="space-y-1 mb-0">
                    <div className="rounded-2xl border border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-transparent px-3 py-2.5 shadow-inner">
                        <div className="flex items-center gap-2.5 text-foreground">
                            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/10">
                                <Wallet2 className="h-3.5 w-3.5" />
                            </span>
                            <div className="flex flex-col">
                                <ChronoSectionLabel size="xs">
                                    Total estimado
                                </ChronoSectionLabel>
                                <span className="text-[9px] text-foreground/70">
                                    Última actualización {exit.dateLabel} · {exit.timeLabel}
                                </span>
                            </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                            <ChronoValue size="lg" weight="bold">
                                {formatCurrency(detail.finalAmount)}
                            </ChronoValue>
                            {discount > 0 && (
                                <ChronoBadge className="border-green-500/40 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                    Descuento {discount}%
                                </ChronoBadge>
                            )}
                        </div>

                        <p className="mt-1 text-[10px] text-muted-foreground">
                            Subtotal antes de descuentos: {formatCurrency(detail.calculatedAmount)}
                        </p>
                    </div>

                    <div className="grid gap-1.5 md:grid-cols-2">
                        <LabelValueComponent
                            label="Entrada"
                            helper={entry.dateLabel}
                            value={entry.timeLabel}
                            icon={<CalendarClock className="h-4 w-4" />}
                            size="mini"
                        />

                        <LabelValueComponent
                            label="Salida"
                            helper={exit.dateLabel}
                            value={exit.timeLabel}
                            icon={<CalendarClock className="h-4 w-4" />}
                            size="mini"
                        />

                        <LabelValueComponent
                            label="Duración"
                            helper={`${detail.durationMinutes} minutos`}
                            value={detail.durationFormatted ?? `${detail.durationMinutes} min`}
                            icon={<Clock8 className="h-4 w-4" />}
                            size="mini"
                        />

                        <LabelValueComponent
                            label="Tiempo de gracia"
                            helper="Ventana sin cargo"
                            value={`${detail.gracePeriodMinutes} min`}
                            icon={<TimerReset className="h-4 w-4" />}
                            size="mini"
                        />
                    </div>
                </ChronoCardContent>
            </ChronoCard>

            <ChronoCard className="bg-card/95 h-min">
                <ChronoCardHeader className="gap-1.5">
                    <ChronoCardTitle className="text-sm font-semibold">Reglas aplicadas</ChronoCardTitle>
                </ChronoCardHeader>

                <ChronoCardContent className="space-y-1">
                    {visibleRules.length ? (
                        <div className="grid gap-1.5 sm:grid-cols-2">
                            {visibleRules.map((rule, idx) => (
                                <div
                                    key={`${rule.ruleType}-${idx}`}
                                    className="rounded-2xl border border-border/60 px-3 py-1.5"
                                >
                                    <div className="flex items-center justify-between gap-1.5">
                                        <span className="text-[12px] font-semibold text-foreground">
                                            {rule.ruleType}
                                        </span>
                                        <ChronoBadge variant="outline" className="border-primary/40 px-2 py-0.5 text-[10px] text-foreground">
                                            {formatCurrency(rule.amount ?? 0)}
                                        </ChronoBadge>
                                    </div>
                                    {rule.description && (
                                        <p className="mt-1 text-[10px] text-muted-foreground line-clamp-2">
                                            {rule.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
                            Sin reglas aplicadas para este cálculo.
                        </div>
                    )}

                    {hiddenRules > 0 && (
                        <p className="text-center text-[10px] text-muted-foreground">
                            + {hiddenRules} reglas adicionales no mostradas para mantener el resumen compacto.
                        </p>
                    )}
                </ChronoCardContent>
            </ChronoCard>
        </div>
    );
}
