"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { updateRoleAction } from "../actions/update-role.action";
import { replaceRoleActionsAction } from "../actions/replace-role-actions.action";
import { getRoleAction } from "../actions/get-role.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type {
  IRoleEntity,
  IRoleDetailEntity,
  IActionGroupEntity,
} from "@/server/domain";
import {
  UpdateRoleForm,
  UpdateRoleSchema,
} from "@/shared/schemas/auth/role.schema";
import { EditRoleFormComponent } from "./edit-role-form.component";

interface Props {
  role: IRoleEntity;
  actionGroups: IActionGroupEntity[];
}

export function EditRoleDialogContent({ role, actionGroups }: Props) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();
  const [roleDetail, setRoleDetail] = React.useState<IRoleDetailEntity | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDetail = async () => {
      const res = await getRoleAction(role.id);
      if (res.success && res.data?.success) {
        setRoleDetail(res.data.data);
      } else {
        toast.error(res.error || "Error al cargar detalle del rol");
      }
      setLoading(false);
    };
    fetchDetail();
  }, [role.id]);

  const handleSubmit = async (data: UpdateRoleForm, actionIds: string[]) => {
    const parsed = UpdateRoleSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return false;
    }

    const toastId = toast.loading("Actualizando rol...");
    try {
      const payload = {
        name: parsed.data.name || undefined,
        description: parsed.data.description || undefined,
        isActive: parsed.data.isActive,
      };

      const result = await updateRoleAction(role.id, payload);
      if (!result.success) {
        toast.error(result.error || "Error al actualizar el rol", {
          id: toastId,
        });
        return false;
      }

      // Replace actions
      const actionsResult = await replaceRoleActionsAction(role.id, actionIds);
      if (!actionsResult.success) {
        toast.warning(
          "Rol actualizado, pero hubo un error al actualizar permisos: " +
            (actionsResult.error ?? ""),
          { id: toastId },
        );
        closeDialog();
        router.refresh();
        return true;
      }

      toast.success("Rol actualizado correctamente", { id: toastId });
      closeDialog();
      router.refresh();
      return true;
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Error inesperado al actualizar el rol", { id: toastId });
      return false;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">
          Cargando detalle del rol...
        </span>
      </div>
    );
  }

  return (
    <EditRoleFormComponent
      role={role}
      currentActionIds={roleDetail?.roleActions?.map((ra) => ra.actionId) ?? []}
      onSubmit={handleSubmit}
      onCancel={closeDialog}
      actionGroups={actionGroups}
    />
  );
}
