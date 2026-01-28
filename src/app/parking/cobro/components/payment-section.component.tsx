"use client";

import "reflect-metadata"

import { useEffect, useMemo, useState } from "react";
import { ScanQrCode, Banknote, ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardFooter,
  ChronoCardHeader,
} from "@chrono/chrono-card.component";
import ChronoCashInput from "@chrono/chrono-cash-input.component";
import { ChronoLabel } from "@chrono/chrono-label.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import EmptyState from "@/src/shared/components/empty-state.component";
import { usePaymentContext } from "@/src/shared/context/payment.context";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import { useCommonContext } from "@/src/shared/context/common.context";
import { generatePaymentAction } from "@/src/app/parking/cobro/actions/generate-payment.action";
import { toast } from "sonner";
import { ChronoInput } from "@chrono/chrono-input.component";
import { usePrint } from "@/src/shared/hooks/common/use-print.hook";

const steps = [
  { id: "method", badge: "1", title: "Método de pago", description: "" },
  { id: "amount", badge: "2", title: "Monto recibido", description: "" },
  { id: "confirm", badge: "3", title: "Confirmar", description: "" },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

type PaymentSectionProps = {
  className?: string;
};

export function PaymentSectionComponent({ className }: PaymentSectionProps) {
  const { validateRaw, clearValidateResult } = usePaymentContext();
  const { showYesNoDialog } = UseDialogContext();
  const { paymentMethods } = useCommonContext();
  const { printPaymentTicketByPaymentId } = usePrint();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [amountReceived, setAmountReceived] = useState("");
  const [notes, setNotes] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingGenerate, setPendingGenerate] = useState(false);

  const totalAmount = validateRaw?.data?.finalAmount ?? 0;
  const parkingSessionId = validateRaw?.data?.parkingSessionId;
  const validatedLicensePlate = validateRaw?.data?.vehicle?.licensePlate?.trim?.() ?? "";
  const hasValidatedPlate = Boolean(validatedLicensePlate);

  const changeValue = useMemo(() => {
    const parsed = Number(amountReceived);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(parsed - totalAmount, 0);
  }, [amountReceived, totalAmount]);

  const clampStep = (index: number) => Math.max(0, Math.min(index, steps.length - 1));
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => setCurrentStep((prev) => clampStep(prev + 1));
  const prevStep = () => setCurrentStep((prev) => clampStep(prev - 1));
  const goToStep = (index: number) => setCurrentStep(clampStep(index));

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const resetPaymentForm = () => {
    setSelectedMethod(null);
    setAmountReceived("0");
    setNotes("");
    setCurrentStep(0);
  };

  const handlePrintPrompt = async (paymentId: string) => {
    showYesNoDialog({
      title: "Imprimir comprobante",
      description: "¿Desea imprimir el comprobante de pago?",
      handleYes: async () => {
        const toastId = toast.loading("Enviando impresión...");
        try {
          const printRes = await printPaymentTicketByPaymentId(paymentId);
          if (!printRes.success) {
            toast.error("Error al imprimir", {
              description: printRes.error || "Intenta nuevamente más tarde.",
              id: toastId,
            });
            return;
          }

          toast.success("Impresión enviada correctamente", { id: toastId });
        } catch (error) {
          console.error("Error printing payment ticket:", error);
          toast.error("Error inesperado al imprimir", { id: toastId });
        } finally {
          clearValidateResult();
        }
      },
      handleNo: async () => {},
    });
  };

  const processPayment = async () => {
    const toastId = toast.loading("Registrando pago...");
    try {
      const res = await generatePaymentAction({
        parkingSessionId: parkingSessionId!,
        paymentMethodId: selectedMethod!,
        amountReceived: Number(amountReceived),
        notes,
      });
      
      if(!res.success || !res.data){
        toast.error("Error al registrar el pago", {
          description: res.error || "Intenta nuevamente más tarde.",
          id: toastId,
        });
        return;
      }

      toast.success("Pago registrado exitosamente", { id: toastId });

      const paymentId = res.data.data.paymentId ?? res.data.data.session?.paymentId;
      if (!paymentId) {
        toast.error("Pago registrado, pero no se recibió un ID de pago para imprimir", {
          description: "Verifica el tipado/forma de la respuesta del backend.",
        });
        resetPaymentForm();
        return;
      }

      await handlePrintPrompt(paymentId);
      resetPaymentForm();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error inesperado al registrar el pago", { id: toastId });
    }
  };

  const validatePaymentData = (): boolean => {
    if (!parkingSessionId) {
      toast.error("No hay una sesión de parqueo activa");
      return false;
    }

    if (!hasValidatedPlate) {
      toast.error("Falta la placa del vehículo", {
        description: "Ingresa la placa al lado del QR para revalidar y continuar.",
      });
      setPendingGenerate(true);
      return false;
    }

    if (!selectedMethod) {
      toast.error("Debes seleccionar un método de pago");
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (!pendingGenerate) return;
    if (!hasValidatedPlate) return;

    // Only auto-continue if the rest of the required data is ready.
    if (!parkingSessionId) return;
    if (!selectedMethod) return;

    setPendingGenerate(false);
    handleRegisterPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingGenerate, hasValidatedPlate, parkingSessionId, selectedMethod]);

  const handleRegisterPayment = async () => {
    if (!validatePaymentData()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await processPayment();
    } catch (error) {
      console.error("Error al registrar pago:", error);
      toast.error("Error inesperado al registrar el pago");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  const handleContinue = () => {
    if (isLastStep) {
      handleRegisterPayment();
      return;
    }
    nextStep();
  };

  if (!validateRaw) {
    return (
      <ChronoCard className={cn("gap-0 overflow-hidden", className)}>
        <ChronoCardContent className="flex items-center justify-center py-5 my-auto">
          <EmptyState
            title="Sin datos validados"
            description="Escanea un código QR o ingresa el número de sesión para continuar con el cobro."
            icon={<ScanQrCode className="h-8 w-8" />}
          />
        </ChronoCardContent>
      </ChronoCard>
    );
  }

  return (
    <ChronoCard className={cn("flex h-full min-w-0 flex-col gap-0 overflow-hidden animate-in fade-in duration-500", className)}>
      <ChronoCardHeader className="space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <ChronoSectionLabel size="xs">
              Total del cobro
            </ChronoSectionLabel>
            <ChronoValue size="lg">
              {formatCurrency(totalAmount)}
            </ChronoValue>
          </div>
          <div className="text-right">
            <ChronoSectionLabel size="xs">
              Cambio estimado
            </ChronoSectionLabel>
            <ChronoValue
              size="md"
              className={changeValue > 0 ? "text-emerald-400" : ""}
              muted={changeValue === 0}
            >
              {changeValue > 0 ? formatCurrency(changeValue) : "--"}
            </ChronoValue>
          </div>
        </div>
        <ChronoCardDescription className="text-[10px]">
          Sigue los pasos para registrar el pago y validar los datos antes de confirmar.
        </ChronoCardDescription>
        <div className="h-1 rounded-full bg-border/50">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </ChronoCardHeader>

      <ChronoCardContent className="flex flex-1 min-w-0 flex-col overflow-y-auto py-0 pr-1">
        <div className="flex items-center justify-between pt-1">
          <ChronoSectionLabel size="md" className="tracking-[0.35em]">
            Pasos
          </ChronoSectionLabel>
          <ChronoSectionLabel size="md" className="tracking-[0.35em]">
            {currentStep + 1}/{steps.length}
          </ChronoSectionLabel>
        </div>

        <div className="flex flex-wrap gap-1 min-w-0">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(index)}
                className={cn(
                  "flex min-w-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition-all",
                  isActive
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-border/50 text-muted-foreground hover:border-primary/40"
                )}
              >
                <ChronoBadge variant="outline" className="w-5 shrink-0 border-primary/30 text-[10px]">
                  {step.badge}
                </ChronoBadge>
                <span className="truncate">{step.title}</span>
              </button>
            );
          })}
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-300"
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {steps.map((step) => {
              return (
                <div key={step.id} className="flex w-full shrink-0 basis-full flex-col gap-2 p-1.5 justify-center">

                  <div className="min-w-0">
                    {step.id === "method" && (
                      <div className="grid gap-1.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {paymentMethods.map((method) => {
                          return (
                            <button
                              key={method.value}
                              type="button"
                              onClick={() => handleMethodSelect(method.value)}
                              className={cn(
                                "flex w-full min-w-0 items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left shadow-sm transition-all",
                                selectedMethod === method.value
                                  ? "border-primary/60 bg-primary/10 text-foreground"
                                  : "border-border/60 bg-background/60 text-muted-foreground hover:border-primary/40"
                              )}
                            >
                              <div className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                                selectedMethod === method.value
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted/50 text-muted-foreground"
                              )}>
                                <Banknote className="h-4 w-4" />
                              </div>
                              <span className="min-w-0 truncate text-sm font-semibold">{method.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {step.id === "amount" && (
                      <div className="space-y-4">
                        <div className="space-y-0.5">
                          <ChronoLabel htmlFor="amount-received" className="text-xs text-muted-foreground">
                            Monto recibido
                          </ChronoLabel>
                          <ChronoCashInput
                            id="amount-received"
                            value={amountReceived}
                            onChange={(event) => setAmountReceived(event.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <ChronoLabel htmlFor="notes" className="text-xs text-muted-foreground">
                            Notas (opcional)
                          </ChronoLabel>
                          <ChronoInput
                            id="notes"
                            type="text"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            className="h-9 text-sm"
                            placeholder="Observaciones adicionales"
                          />
                        </div>
                      </div>
                    )}

                    {step.id === "confirm" && (
                      <div className="space-y-2">
                        <div className="rounded-lg border border-border/50 bg-background/30 p-2 space-y-1.5">
                          {[ 
                            {
                              label: "Método de pago",
                              value: paymentMethods.find((method) => method.value === selectedMethod)?.label ?? "--",
                            },
                            {
                              label: "Monto recibido",
                              value: formatCurrency(Number(amountReceived) || 0),
                            },
                            {
                              label: "Total a cobrar",
                              value: formatCurrency(totalAmount),
                            },
                            {
                              label: "Cambio",
                              value: changeValue > 0 ? formatCurrency(changeValue) : "$0",
                              highlight: changeValue > 0,
                            },
                          ].map((item) => (
                            <div key={item.label} className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">
                                {item.label}
                              </span>
                              <span className={cn(
                                "text-sm font-semibold",
                                item.highlight ? "text-emerald-400" : "text-foreground"
                              )}>
                                {item.value}
                              </span>
                            </div>
                          ))}
                          {notes && (
                            <div className="pt-1.5 border-t border-border/50">
                              <span className="text-xs text-muted-foreground block mb-1">Notas</span>
                              <span className="text-sm text-foreground">{notes}</span>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ChronoCardContent>
      <ChronoCardFooter>
        <div className="ml-auto flex items-center gap-2 text-xs">
          {currentStep > 0 && (
            <ChronoButton variant="ghost" size="icon-lg" onClick={prevStep} icon={<ArrowBigLeft/>}/>
          )}
          {currentStep < steps.length - 1 ? (
            <ChronoButton size="icon-lg" icon={<ArrowBigRight/>} onClick={handleContinue}/>
          ) : (
            <ChronoButton size="icon-lg" onClick={handleRegisterPayment} loading={isSubmitting} icon={<Banknote/>}/>
          )}
        </div>
      </ChronoCardFooter>
    </ChronoCard>
  );
}
