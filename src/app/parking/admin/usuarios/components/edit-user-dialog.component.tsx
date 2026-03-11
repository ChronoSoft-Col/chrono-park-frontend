"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateUserAction } from "../actions/update-user.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type { IUserEntity, IUpdateUserParamsEntity } from "@/server/domain";
import { UpdateUserForm, UpdateUserSchema } from "@/shared/schemas/auth/user.schema";
import { EditUserFormComponent } from "./edit-user-form.component";

interface Props {
  user: IUserEntity;
  roles: { value: string; label: string }[];
}

export function EditUserDialogContent({ user, roles }: Props) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const handleSubmit = async (data: UpdateUserForm) => {
    const parsed = UpdateUserSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return false;
    }

    const toastId = toast.loading("Actualizando usuario...");
    try {
      const payload: IUpdateUserParamsEntity = {
        ...parsed.data,
        password: parsed.data.password || undefined,
      };

      const result = await updateUserAction(user.id, payload);
      if (!result.success) {
        toast.error(result.error || "Error al actualizar el usuario", { id: toastId });
        return false;
      }

      toast.success("Usuario actualizado correctamente", { id: toastId });
      closeDialog();
      router.refresh();
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error inesperado al actualizar el usuario", { id: toastId });
      return false;
    }
  };

  return <EditUserFormComponent user={user} onSubmit={handleSubmit} onCancel={closeDialog} roles={roles} />;
}
