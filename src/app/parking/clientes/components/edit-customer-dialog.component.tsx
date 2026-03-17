"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ICustomerEntity, IUpdateCustomerParamsEntity } from "@/server/domain";
import { UseDialogContext } from "@/src/shared/context/dialog.context";
import {
  UpdateCustomerForm,
  UpdateCustomerSchema,
} from "@/src/shared/schemas/parking/update-customer.schema";

import { updateCustomerAction } from "../actions/update-customer.action";
import { getCustomerByIdAction } from "../actions/get-customer-by-id.action";
import { EditCustomerFormComponent } from "./edit-customer-form.component";

export function EditCustomerDialogContent({ customer }: { customer: ICustomerEntity }) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const [resolvedCustomer, setResolvedCustomer] = useState<ICustomerEntity>(customer);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoadingCustomer(true);
      const result = await getCustomerByIdAction(customer.id);
      if (cancelled) return;

      if (result.success && result.data?.success && result.data.data) {
        setResolvedCustomer(result.data.data);
      }
      setIsLoadingCustomer(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [customer.id]);

  const customerToEdit = useMemo(
    () => (isLoadingCustomer ? customer : resolvedCustomer),
    [customer, isLoadingCustomer, resolvedCustomer],
  );

  const handleSubmit = async (data: UpdateCustomerForm) => {
    const parsed = UpdateCustomerSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return false;
    }

    const toastId = toast.loading("Actualizando cliente...");
    try {
      const payload: IUpdateCustomerParamsEntity = {
        ...parsed.data,
        email: parsed.data.email || undefined,
        phoneNumber: parsed.data.phoneNumber || undefined,
        agreementId: parsed.data.agreementId || undefined,
      };

      const result = await updateCustomerAction(customer.id, payload);
      if (!result.success || !result.data?.success) {
        toast.error(result.error || result.data?.message || "Error al editar el cliente", { id: toastId });
        return false;
      }

      toast.success("Cliente actualizado correctamente", { id: toastId });
      closeDialog();
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Error inesperado al actualizar el cliente", { id: toastId });
      return false;
    }
  };

  return (
    <EditCustomerFormComponent
      customer={customerToEdit}
      onSubmit={handleSubmit}
      onCancel={closeDialog}
    />
  );
}
