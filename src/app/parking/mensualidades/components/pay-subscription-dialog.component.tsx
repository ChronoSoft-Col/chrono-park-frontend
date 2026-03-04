"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { calculatePriceAction } from "../actions/calculate-price.action";
import { paySubscriptionAction } from "../actions/pay-subscription.action";
import { PriceCalculationCard } from "./price-calculation-card.component";
import { SubscriptionInfoCard } from "./subscription-info-card.component";
import { UseDialogContext } from "@/shared/context/dialog.context";
import { useCommonStore } from "@/src/shared/stores/common.store";
import { usePrint } from "@/shared/hooks/common/use-print.hook";
import { ISubscriptionEntity, IPriceCalculation } from "@/server/domain";
import { useClientSession } from "@/src/lib/session-client";
import { hasPermission } from "@/src/shared/utils/permissions.util";
import { MensualidadesAction } from "@/src/shared/enums/auth/permissions.enum";
import { usePaySubscriptionDialogUiStore } from "../stores/pay-subscription-dialog-ui.store";
import {
  PaySubscriptionForm,
  PaySubscriptionSchema,
} from "@/shared/schemas/parking/create-subscription.schema";
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

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type Props = {
  subscription: ISubscriptionEntity;
};

const PAY_SUBSCRIPTION_FORM_ID = "pay-subscription-form";

export function PaySubscriptionDialogContent({ subscription }: Props) {
  const router = useRouter();
  const { closeDialog, showYesNoDialog } = UseDialogContext();
  const { paymentMethods } = useCommonStore();
  const { printPaymentTicketByPaymentId } = usePrint();
  const { data: session } = useClientSession();
  const canApplyDiscount = hasPermission(session ?? null, MensualidadesAction.APLICAR_DESCUENTO);

  const { setUi, reset } = usePaySubscriptionDialogUiStore();

  const [priceCalculation, setPriceCalculation] = useState<IPriceCalculation | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [hasFetchedPrice, setHasFetchedPrice] = useState(false);

  const form = useForm<PaySubscriptionForm>({
    resolver: zodResolver(PaySubscriptionSchema) as Resolver<PaySubscriptionForm>,
    mode: "onChange",
    defaultValues: {
      paymentMethodId: "",
      monthsCount: 1,
      discountType: undefined,
      discountValue: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isValid },
  } = form;

  const monthsCount = watch("monthsCount");
  const discountType = watch("discountType");
  const discountValue = watch("discountValue");

  useEffect(() => {
    setUi({ isSubmitting, isValid, loadingPrice });
  }, [isSubmitting, isValid, loadingPrice, setUi]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    setHasFetchedPrice(false);
    setPriceCalculation(null);
  }, [subscription.id]);

  // Calcular precio cuando cambia la cantidad de meses (con debounce)
  useEffect(() => {
    if (!subscription.id || !monthsCount || monthsCount < 1 || monthsCount > 12) return;

    const shouldSendDiscount =
      canApplyDiscount &&
      Boolean(discountType) &&
      discountValue !== undefined &&
      Number.isFinite(discountValue);

    const effectiveDiscountType = shouldSendDiscount ? discountType : undefined;
    const effectiveDiscountValue = shouldSendDiscount ? discountValue : undefined;

    const timeout = setTimeout(async () => {
      setLoadingPrice(true);
      try {
        const result = await calculatePriceAction(
          subscription.id,
          monthsCount,
          effectiveDiscountType,
          effectiveDiscountValue
        );
        if (result.success && result.data?.data) {
          setPriceCalculation(result.data.data);
          setHasFetchedPrice(true);
        }
      } catch (error) {
        console.error("Error calculating price:", error);
      } finally {
        setLoadingPrice(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [subscription.id, monthsCount, canApplyDiscount, discountType, discountValue]);

  const handlePayment = handleSubmit(async (data) => {
    const toastId = toast.loading("Procesando pago...");
    try {
      const shouldSendDiscount =
        canApplyDiscount &&
        Boolean(data.discountType) &&
        data.discountValue !== undefined &&
        Number.isFinite(data.discountValue);

      const result = await paySubscriptionAction(subscription.id, {
        paymentMethodId: data.paymentMethodId,
        monthsCount: data.monthsCount,
        ...(shouldSendDiscount
          ? {
              discountType: data.discountType,
              discountValue: data.discountValue,
            }
          : {}),
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

  return (
    <div className="py-4">
      <div className="grid gap-6 md:grid-cols-5 items-center">
        <PriceCalculationCard
          className="md:col-span-2"
          priceCalculation={priceCalculation}
          loading={loadingPrice}
          hasFetched={hasFetchedPrice}
          monthsCount={monthsCount}
        />

        {/* Right column: customer info + payment form */}
        <div className="space-y-6 md:col-span-3">
          <SubscriptionInfoCard subscription={subscription} />

          {/* Payment Form */}
          <form
            id={PAY_SUBSCRIPTION_FORM_ID}
            onSubmit={handlePayment}
            className="flex flex-col gap-4"
          >
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
                      onBlur={() => {
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

            {canApplyDiscount && (
              <div className="grid gap-3 md:grid-cols-2">
                <Controller
                  control={control}
                  name="discountType"
                  render={({ field, fieldState }) => (
                    <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                      <ChronoFieldLabel htmlFor="discountType" className={fieldLabelClasses}>
                        Tipo de descuento (opcional)
                      </ChronoFieldLabel>

                      <ChronoSelect
                        onValueChange={(value) => {
                          if (!value || value === "__NONE__") {
                            field.onChange(undefined);
                            setValue("discountValue", undefined, { shouldValidate: true, shouldDirty: true });
                            return;
                          }

                          if (value !== "PERCENTAGE" && value !== "FIXED_AMOUNT") {
                            field.onChange(undefined);
                            setValue("discountValue", undefined, { shouldValidate: true, shouldDirty: true });
                            return;
                          }

                          field.onChange(value);
                        }}
                        value={field.value ?? "__NONE__"}
                      >
                        <ChronoSelectTrigger className="mt-1 text-left">
                          <ChronoSelectValue placeholder="Sin descuento" />
                        </ChronoSelectTrigger>
                        <ChronoSelectContent>
                          <ChronoSelectItem value="__NONE__">Sin descuento</ChronoSelectItem>
                          <ChronoSelectItem value="PERCENTAGE">Porcentaje</ChronoSelectItem>
                          <ChronoSelectItem value="FIXED_AMOUNT">Monto fijo</ChronoSelectItem>
                        </ChronoSelectContent>
                      </ChronoSelect>

                      {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
                    </ChronoField>
                  )}
                />

                <Controller
                  control={control}
                  name="discountValue"
                  render={({ field, fieldState }) => (
                    <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                      <ChronoFieldLabel htmlFor="discountValue" className={fieldLabelClasses}>
                        Valor del descuento
                      </ChronoFieldLabel>

                      <ChronoInput
                        {...field}
                        id="discountValue"
                        type="number"
                        min={0}
                        step={1}
                        disabled={!discountType}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (raw === "") {
                            field.onChange(undefined);
                            return;
                          }
                          const num = Number(raw);
                          if (Number.isFinite(num)) field.onChange(num);
                        }}
                        className="mt-1"
                      />

                      {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
                    </ChronoField>
                  )}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export const PAY_SUBSCRIPTION_DIALOG_FORM_ID = PAY_SUBSCRIPTION_FORM_ID;
