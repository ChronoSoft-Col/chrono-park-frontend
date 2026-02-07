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

    const toastId = toast.loading("Creando mensualidad...");
    try {
      const payload: ICreateSubscriptionParamsEntity = {
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
        rateProfileId: parsed.data.rateProfileId,
        customer: {
          ...parsed.data.customer,
          email: parsed.data.customer.email || undefined,
          phoneNumber: parsed.data.customer.phoneNumber || undefined,
        },
        vehicle: parsed.data.vehicle
          ? {
              ...parsed.data.vehicle,
            }
          : undefined,
      };

      const result = await createSubscriptionAction(payload);
      if (!result.success || !result.data?.success) {
        toast.error(
          result.error || result.data?.message || "Error al crear la mensualidad",
          { id: toastId }
        );
        return false;
      }

      toast.success("Mensualidad creada correctamente", { id: toastId });
      closeDialog();
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Error inesperado al crear la mensualidad", { id: toastId });
      return false;
    }
  };

  return <CreateSubscriptionFormComponent onSubmit={handleSubmit} onCancel={closeDialog} />;
}
