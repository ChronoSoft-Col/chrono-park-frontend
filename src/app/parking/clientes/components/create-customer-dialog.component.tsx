"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createCustomerAction } from "../actions/create-customer.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type { ICreateCustomerParamsEntity } from "@/server/domain";
import { CreateCustomerForm, CreateCustomerSchema } from "@/shared/schemas/parking/create-customer.schema";

import { CreateCustomerFormComponent } from "./create-customer-form.component";

export function CreateCustomerDialogContent() {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const handleSubmit = async (data: CreateCustomerForm) => {
    const parsed = CreateCustomerSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return false;
    }

    const toastId = toast.loading("Creando cliente...");
    try {
      const payload: ICreateCustomerParamsEntity = {
        ...parsed.data,
        email: parsed.data.email || undefined,
        phoneNumber: parsed.data.phoneNumber || undefined,
        agreementId: parsed.data.agreementId || undefined,
      };

      const result = await createCustomerAction(payload);
      if (!result.success || !result.data?.success) {
        toast.error(result.error || result.data?.message || "Error al crear el cliente", { id: toastId });
        return false;
      }

      toast.success("Cliente creado correctamente", { id: toastId });
      closeDialog();
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Error inesperado al crear el cliente", { id: toastId });
      return false;
    }
  };

  return <CreateCustomerFormComponent onSubmit={handleSubmit} onCancel={closeDialog} />;
}
