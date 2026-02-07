"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createSubscriptionAction } from "../actions/create-subscription.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type { ICreateSubscriptionParamsEntity } from "@/server/domain";
import {
  CreateSubscriptionForm,
  CreateSubscriptionSchema,
} from "@/shared/schemas/parking/create-subscription.schema";

import { CreateSubscriptionFormComponent } from "./create-subscription-form.component";

export function CreateSubscriptionDialogContent() {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const handleSubmit = async (data: CreateSubscriptionForm) => {
    const parsed = CreateSubscriptionSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return false;
    }

    const toastId = toast.loading("Creando suscripción...");
    try {
      const payload: ICreateSubscriptionParamsEntity = {
        customerId: parsed.data.customerId,
        monthlyPlanId: parsed.data.monthlyPlanId,
        vehicleId: parsed.data.vehicleId || undefined,
      };

      const result = await createSubscriptionAction(payload);
      if (!result.success || !result.data?.success) {
        toast.error(
          result.error || result.data?.message || "Error al crear la suscripción",
          { id: toastId }
        );
        return false;
      }

      toast.success("Suscripción creada correctamente. Proceda al pago.", { id: toastId });
      closeDialog();
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Error inesperado al crear la suscripción", { id: toastId });
      return false;
    }
  };

  return <CreateSubscriptionFormComponent onSubmit={handleSubmit} onCancel={closeDialog} />;
}
