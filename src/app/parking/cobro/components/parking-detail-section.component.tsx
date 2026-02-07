"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/src/shared/components/empty-state.component";
import { usePaymentContext } from "@/src/shared/context/payment.context";
import { useCommonContext } from "@/src/shared/context/common.context";
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
import {
    ChronoSelect,
    ChronoSelectContent,
    ChronoSelectItem,
    ChronoSelectTrigger,
    ChronoSelectValue,
} from "@chrono/chrono-select.component";
import { ChronoLabel } from "@chrono/chrono-label.component";
import { CalendarClock, Clock8, TimerReset, Wallet2, X, RefreshCw, Package } from "lucide-react";
import { cn } from "@/src/lib/utils";
import ChronoButton from "@chrono/chrono-button.component";

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
    const { 
        validateRaw, 
        availableRates, 
        isLoadingRates, 
        loadRatesForVehicleType, 
        recalculateWithRate,
        isValidating,
        sessionServices,
        sessionServicesTotal
    } = usePaymentContext();
    const { vehicleTypes } = useCommonContext();
    const [showRateSelector, setShowRateSelector] = useState(false);
    const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState<string | null>(null);
    const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

    const detail: QrAmountDetail | null = validateRaw?.data ?? null;
    const currentVehicleTypeId = validateRaw?.data?.vehicle?.vehicleType?.id;
    const currentVehicleTypeName = validateRaw?.data?.vehicle?.vehicleType?.name;

    // Reset rate selector when validateRaw changes (new validation)
    useEffect(() => {
        setShowRateSelector(false);
        setSelectedVehicleTypeId(null);
        setSelectedRateId(null);
    }, [validateRaw]);

    // When opening selector, set the current vehicle type as selected
    useEffect(() => {
        if (showRateSelector && currentVehicleTypeId && !selectedVehicleTypeId) {
            setSelectedVehicleTypeId(currentVehicleTypeId);
            loadRatesForVehicleType(currentVehicleTypeId);
        }
    }, [showRateSelector, currentVehicleTypeId, selectedVehicleTypeId, loadRatesForVehicleType]);

    const handleVehicleTypeChange = (vehicleTypeId: string) => {
        setSelectedVehicleTypeId(vehicleTypeId);
        setSelectedRateId(null);
        loadRatesForVehicleType(vehicleTypeId);
    };

    const handleRateSelect = (rateId: string) => {
        setSelectedRateId(rateId);
    };

    const handleRevalidate = async () => {
        if (!selectedRateId) return;
        const success = await recalculateWithRate(selectedRateId);
        if (success) {
            setShowRateSelector(false);
            setSelectedVehicleTypeId(null);
            setSelectedRateId(null);
        }
    };

    const handleToggleRateSelector = () => {
        if (showRateSelector) {
            // Closing
            setShowRateSelector(false);
            setSelectedVehicleTypeId(null);
            setSelectedRateId(null);
        } else {
            // Opening
            setShowRateSelector(true);
        }
    };

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
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <ChronoSectionLabel size="base">
                                    Perfil de tarifa
                                </ChronoSectionLabel>
                                {!showRateSelector && (
                                    <ChronoButton
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={handleToggleRateSelector}
                                        disabled={isValidating}
                                    >
                                        <RefreshCw className="h-3 w-3 mr-1" />
                                        Cambiar tarifa
                                    </ChronoButton>
                                )}
                            </div>
                            {showRateSelector ? (
                                <div className="flex flex-col gap-2 mt-2 p-3 rounded-lg border border-primary/20 bg-primary/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Seleccionar nueva tarifa</span>
                                        <ChronoButton
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={handleToggleRateSelector}
                                            disabled={isValidating}
                                            title="Cancelar"
                                        >
                                            <X className="h-4 w-4" />
                                        </ChronoButton>
                                    </div>
                                    
                                    <div className="flex items-end gap-2">
                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <ChronoLabel className="text-xs text-muted-foreground">
                                                Tipo vehículo
                                            </ChronoLabel>
                                            <ChronoSelect
                                                value={selectedVehicleTypeId ?? undefined}
                                                onValueChange={handleVehicleTypeChange}
                                                disabled={isValidating}
                                            >
                                                <ChronoSelectTrigger className="h-9 text-sm">
                                                    <ChronoSelectValue placeholder="Tipo" />
                                                </ChronoSelectTrigger>
                                                <ChronoSelectContent>
                                                    {vehicleTypes.map((vt) => (
                                                        <ChronoSelectItem key={vt.value} value={vt.value}>
                                                            {vt.label}
                                                        </ChronoSelectItem>
                                                    ))}
                                                </ChronoSelectContent>
                                            </ChronoSelect>
                                        </div>

                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <ChronoLabel className="text-xs text-muted-foreground">
                                                Tarifa
                                            </ChronoLabel>
                                            <ChronoSelect
                                                value={selectedRateId ?? undefined}
                                                onValueChange={handleRateSelect}
                                                disabled={isLoadingRates || isValidating || !selectedVehicleTypeId}
                                            >
                                                <ChronoSelectTrigger className="h-9 text-sm">
                                                    <ChronoSelectValue 
                                                        placeholder={
                                                            isLoadingRates 
                                                                ? "Cargando..." 
                                                                : availableRates.length === 0 
                                                                    ? "Sin tarifas"
                                                                    : "Tarifa"
                                                        } 
                                                    />
                                                </ChronoSelectTrigger>
                                                <ChronoSelectContent>
                                                    {availableRates.map((rate) => (
                                                        <ChronoSelectItem key={rate.id} value={rate.id}>
                                                            {rate.name}
                                                        </ChronoSelectItem>
                                                    ))}
                                                </ChronoSelectContent>
                                            </ChronoSelect>
                                        </div>

                                        <ChronoButton
                                            type="button"
                                            variant="default"
                                            size="sm"
                                            className="h-9"
                                            onClick={handleRevalidate}
                                            disabled={isValidating || !selectedRateId}
                                        >
                                            <RefreshCw className={cn("h-3.5 w-3.5 mr-1", isValidating && "animate-spin")} />
                                            Revalidar
                                        </ChronoButton>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <ChronoValue size="md">
                                        {detail.rateProfileName}
                                    </ChronoValue>
                                    {currentVehicleTypeName && (
                                        <ChronoBadge variant="outline" className="text-xs">
                                            {currentVehicleTypeName}
                                        </ChronoBadge>
                                    )}
                                </div>
                            )}
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
                    <ChronoCardTitle className="text-sm font-semibold">Desglose de cobro</ChronoCardTitle>
                </ChronoCardHeader>

                <ChronoCardContent className="space-y-3">
                    {/* Reglas aplicadas */}
                    {visibleRules.length > 0 && (
                        <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Reglas aplicadas</p>
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
                            {hiddenRules > 0 && (
                                <p className="text-center text-[10px] text-muted-foreground">
                                    + {hiddenRules} reglas adicionales no mostradas.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Servicios adicionales */}
                    {sessionServices.length > 0 && (
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    Servicios adicionales
                                </p>
                                <ChronoBadge variant="secondary" className="px-2 py-0.5 text-[10px]">
                                    {formatCurrency(sessionServicesTotal)}
                                </ChronoBadge>
                            </div>
                            <div className="grid gap-1.5 sm:grid-cols-2">
                                {sessionServices.map((service) => (
                                    <div
                                        key={service.id}
                                        className="rounded-2xl border border-border/60 px-3 py-1.5"
                                    >
                                        <div className="flex items-center justify-between gap-1.5">
                                            <span className="text-[12px] font-semibold text-foreground">
                                                {service.serviceName}
                                            </span>
                                            <ChronoBadge variant="outline" className="border-primary/40 px-2 py-0.5 text-[10px] text-foreground">
                                                {formatCurrency(service.totalAmount)}
                                            </ChronoBadge>
                                        </div>
                                        <p className="mt-1 text-[10px] text-muted-foreground">
                                            {service.quantity} x {formatCurrency(service.unitPrice)}
                                            {service.notes && ` • ${service.notes}`}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Estado vacío cuando no hay ni reglas ni servicios */}
                    {visibleRules.length === 0 && sessionServices.length === 0 && (
                        <div className="rounded-2xl border border-dashed px-3 py-4 text-center text-sm text-muted-foreground">
                            Sin reglas ni servicios aplicados para este cálculo.
                        </div>
                    )}
                </ChronoCardContent>
            </ChronoCard>
        </div>
    );
}
