"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createUserAction } from "../actions/create-user.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type { ICreateUserParamsEntity } from "@/server/domain";
import { CreateUserForm, CreateUserSchema } from "@/shared/schemas/auth/user.schema";
import { CreateUserFormComponent } from "./create-user-form.component";

interface Props {
  roles: { value: string; label: string }[];
}

export function CreateUserDialogContent({ roles }: Props) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const handleSubmit = async (data: CreateUserForm) => {
    const parsed = CreateUserSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return false;
    }

    const toastId = toast.loading("Creando usuario...");
    try {
      const payload: ICreateUserParamsEntity = parsed.data;

      const result = await createUserAction(payload);
      if (!result.success || !result.data?.success) {
        toast.error(result.error || result.data?.message || "Error al crear el usuario", { id: toastId });
        return false;
      }

      toast.success("Usuario creado correctamente", { id: toastId });
      closeDialog();
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error inesperado al crear el usuario", { id: toastId });
      return false;
    }
  };

  return <CreateUserFormComponent onSubmit={handleSubmit} onCancel={closeDialog} roles={roles} />;
}
