"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ICustomerEntity, IUpdateCustomerParamsEntity } from "@/server/domain";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import {
  UpdateCustomerForm,
  UpdateCustomerSchema,
} from "@/src/shared/schemas/parking/update-customer.schema";

import { updateCustomerAction } from "../actions/update-customer.action";
import { EditCustomerFormComponent } from "./edit-customer-form.component";

export function EditCustomerDialogContent({ customer }: { customer: ICustomerEntity }) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const handleSubmit = async (data: UpdateCustomerForm) => {
    const parsed = UpdateCustomerSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return false;
    }

    const payload: IUpdateCustomerParamsEntity = {
      ...parsed.data,
      email: parsed.data.email || undefined,
      phoneNumber: parsed.data.phoneNumber || undefined,
      agreementId: parsed.data.agreementId || undefined,
    };

    const result = await updateCustomerAction(customer.id, payload);
    if (!result.success || !result.data?.success) {
      toast.error(result.error || result.data?.message || "Error al editar el cliente");
      return false;
    }

    toast.success("Cliente actualizado correctamente");
    closeDialog();
    router.refresh();
    return true;
  };

  return <EditCustomerFormComponent customer={customer} onSubmit={handleSubmit} onCancel={closeDialog} />;
}
