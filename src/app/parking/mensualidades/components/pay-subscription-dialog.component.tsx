"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Calculator, Loader2 } from "lucide-react";

import { calculatePriceAction } from "../actions/calculate-price.action";
import { paySubscriptionAction } from "../actions/pay-subscription.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import { useCommonStore } from "@/src/shared/stores/common.store";
import { usePrint } from "@/shared/hooks/common/use-print.hook";
import { ISubscriptionEntity, IPriceCalculation } from "@/server/domain";
import {
  PaySubscriptionForm,
  PaySubscriptionSchema,
} from "@/shared/schemas/parking/create-subscription.schema";

import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoField,
  ChronoFieldError,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import { ChronoInput } from "@chrono/chrono-input.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type Props = {
  subscription: ISubscriptionEntity;
};

export function PaySubscriptionDialogContent({ subscription }: Props) {
  const router = useRouter();
  const { closeDialog, showYesNoDialog } = UseDialogContext();
  const { paymentMethods } = useCommonStore();
  const { printPaymentTicketByPaymentId } = usePrint();

  const [priceCalculation, setPriceCalculation] = useState<IPriceCalculation | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const form = useForm<PaySubscriptionForm>({
    resolver: zodResolver(PaySubscriptionSchema) as Resolver<PaySubscriptionForm>,
    mode: "onChange",
    defaultValues: {
      paymentMethodId: "",
      monthsCount: 1,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = form;

  const monthsCount = watch("monthsCount");

  // Calcular precio cuando cambia la cantidad de meses (con debounce)
  useEffect(() => {
    if (!subscription.id || !monthsCount || monthsCount < 1 || monthsCount > 12) return;

    const timeout = setTimeout(async () => {
      setLoadingPrice(true);
      try {
        const result = await calculatePriceAction(subscription.id, monthsCount);
        if (result.success && result.data?.data) {
          setPriceCalculation(result.data.data);
        }
      } catch (error) {
        console.error("Error calculating price:", error);
      } finally {
        setLoadingPrice(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [subscription.id, monthsCount]);

  const handlePayment = handleSubmit(async (data) => {
    const toastId = toast.loading("Procesando pago...");
    try {
      const result = await paySubscriptionAction(subscription.id, {
        paymentMethodId: data.paymentMethodId,
        monthsCount: data.monthsCount,
      });

      if (!result.success || !result.data?.success) {
        toast.error(
          result.error || result.data?.message || "Error al procesar el pago",
          { id: toastId }
        );
        return;
      }

      toast.success("Pago procesado correctamente", { id: toastId });
      
      const paymentId = result.data.data?.paymentId;
      if (paymentId) {
        showYesNoDialog({
          title: "Imprimir comprobante",
          description: "¿Desea imprimir el comprobante de pago?",
          handleYes: async () => {
            const printToastId = toast.loading("Enviando impresión...");
            const printRes = await printPaymentTicketByPaymentId(paymentId);
            if (printRes.success) {
              toast.success("Impresión enviada correctamente", { id: printToastId });
            } else {
              toast.error(printRes.error || "Error al imprimir", { id: printToastId });
            }
            closeDialog();
            router.refresh();
          },
          handleNo: async () => {
            closeDialog();
            router.refresh();
          },
        });
      } else {
        closeDialog();
        router.refresh();
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Error inesperado al procesar el pago", { id: toastId });
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    const d = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(d);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Subscription Info */}
      <div className="rounded-lg border bg-muted/30 p-4">
        <h4 className="mb-3 text-sm font-semibold">Información de la Suscripción</h4>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <div>
            <span className="text-muted-foreground">Cliente: </span>
            <span className="font-medium">
              {subscription.customer?.firstName} {subscription.customer?.lastName}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Plan: </span>
            <span className="font-medium">{subscription.monthlyPlan?.name}</span>
          </div>
          {subscription.vehicle && (
            <div>
              <span className="text-muted-foreground">Vehículo: </span>
              <span className="font-medium">{subscription.vehicle.plateNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Price Calculation */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold">Cálculo de Precio</h4>
          {loadingPrice && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {priceCalculation && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Precio del plan:</span>
              <span>{formatPrice(priceCalculation.planPrice)}</span>
            </div>
            {priceCalculation.proratedDays && priceCalculation.proratedDays > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Días prorrateados ({priceCalculation.proratedDays}):
                </span>
                <span>{formatPrice(priceCalculation.proratedAmount || 0)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Meses:</span>
              <span>x{monthsCount}</span>
            </div>
            <ChronoSeparator className="my-2" />
            <div className="flex justify-between text-base font-semibold text-primary">
              <span>Total a pagar:</span>
              <span>{formatPrice(priceCalculation.totalAmount)}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Período: {formatDate(priceCalculation.periodStart)} - {formatDate(priceCalculation.periodEnd)}
            </div>
          </div>
        )}
      </div>

      <ChronoSeparator />

      {/* Payment Form */}
      <form onSubmit={handlePayment} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Controller
            control={control}
            name="monthsCount"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="monthsCount" className={fieldLabelClasses}>
                  Meses a pagar
                </ChronoFieldLabel>
                <ChronoInput
                  {...field}
                  id="monthsCount"
                  type="number"
                  min={1}
                  max={12}
                  value={field.value}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") {
                      field.onChange(0);
                      return;
                    }
                    const num = parseInt(raw, 10);
                    if (!isNaN(num)) field.onChange(num);
                  }}
                  onBlur={(e) => {
                    const clamped = Math.min(12, Math.max(1, field.value || 1));
                    field.onChange(clamped);
                    field.onBlur();
                  }}
                  className="mt-1"
                />
                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />

          <Controller
            control={control}
            name="paymentMethodId"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="paymentMethodId" className={fieldLabelClasses}>
                  Método de pago
                </ChronoFieldLabel>

                <ChronoSelect onValueChange={field.onChange} value={field.value ?? ""}>
                  <ChronoSelectTrigger className="mt-1 text-left">
                    <ChronoSelectValue placeholder="Seleccionar método" />
                  </ChronoSelectTrigger>
                  <ChronoSelectContent>
                    {paymentMethods.map((method) => (
                      <ChronoSelectItem key={method.value} value={method.value}>
                        {method.label}
                      </ChronoSelectItem>
                    ))}
                  </ChronoSelectContent>
                </ChronoSelect>

                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />
        </div>

        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
          <ChronoButton type="button" variant="outline" onClick={closeDialog} size="lg">
            Cancelar
          </ChronoButton>

          <ChronoButton
            type="submit"
            disabled={!isValid || isSubmitting || loadingPrice}
            loading={isSubmitting}
            icon={<CreditCard className="h-4 w-4" />}
            iconPosition="left"
            size="lg"
          >
            Procesar Pago
          </ChronoButton>
        </div>
      </form>
    </div>
  );
}
