"use client";

import { CreditCard } from "lucide-react";

import { UseDialogContext } from "@/shared/context/dialog.context";
import ChronoButton from "@chrono/chrono-button.component";
import { usePaySubscriptionDialogUiStore } from "../stores/pay-subscription-dialog-ui.store";

type Props = {
  formId: string;
};

export function PaySubscriptionDialogFooter({ formId }: Props) {
  const { closeDialog } = UseDialogContext();
  const { isSubmitting, isValid, loadingPrice } = usePaySubscriptionDialogUiStore();

  return (
    <div className="flex justify-end gap-2">
      <ChronoButton
        type="button"
        variant="outline"
        onClick={closeDialog}
        size="lg"
        disabled={isSubmitting}
      >
        Cancelar
      </ChronoButton>

      <ChronoButton
        type="submit"
        form={formId}
        disabled={!isValid || isSubmitting || loadingPrice}
        loading={isSubmitting}
        icon={<CreditCard className="h-4 w-4" />}
        iconPosition="left"
        size="lg"
      >
        Procesar Pago
      </ChronoButton>
    </div>
  );
}
