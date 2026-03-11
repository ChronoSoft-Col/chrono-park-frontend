"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createRoleAction } from "../actions/create-role.action";
import { replaceRoleActionsAction } from "../actions/replace-role-actions.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type { IActionGroupEntity, ICreateRoleParamsEntity } from "@/server/domain";
import { CreateRoleForm, CreateRoleSchema } from "@/shared/schemas/auth/role.schema";
import { CreateRoleFormComponent } from "./create-role-form.component";

interface Props {
  actionGroups: IActionGroupEntity[];
}

export function CreateRoleDialogContent({ actionGroups }: Props) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const handleSubmit = async (data: CreateRoleForm, actionIds: string[]) => {
    const parsed = CreateRoleSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return false;
    }

    const toastId = toast.loading("Creando rol...");
    try {
      const payload: ICreateRoleParamsEntity = {
        name: parsed.data.name,
        description: parsed.data.description || undefined,
      };

      const result = await createRoleAction(payload);
      if (!result.success || !result.data?.success) {
        toast.error(
          result.error || result.data?.message || "Error al crear el rol",
          { id: toastId },
        );
        return false;
      }

      // Assign actions if selected
      const roleId = result.data.data?.id;
      if (actionIds.length > 0 && roleId) {
        const actionsResult = await replaceRoleActionsAction(roleId, actionIds);
        if (!actionsResult.success) {
          toast.warning(
            "Rol creado, pero hubo un error al asignar permisos: " +
              (actionsResult.error ?? ""),
            { id: toastId },
          );
          closeDialog();
          router.refresh();
          return true;
        }
      }

      toast.success("Rol creado correctamente", { id: toastId });
      closeDialog();
      router.refresh();
      return true;
    } catch (err) {
      console.error("Error creating role:", err);
      toast.error("Error inesperado al crear el rol", { id: toastId });
      return false;
    }
  };

  return (
    <CreateRoleFormComponent
      onSubmit={handleSubmit}
      onCancel={closeDialog}
      actionGroups={actionGroups}
    />
  );
}
