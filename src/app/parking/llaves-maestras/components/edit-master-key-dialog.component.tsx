"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { updateMasterKeyAction } from "../actions/update-master-key.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type { IMasterKeyEntity, IUpdateMasterKeyParamsEntity } from "@/server/domain";
import {
  UpdateMasterKeyForm,
  UpdateMasterKeySchema,
} from "@/src/shared/schemas/parking/master-keys.schema";

import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoField,
  ChronoFieldError,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import { ChronoInput } from "@chrono/chrono-input.component";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

export function EditMasterKeyDialogContent({ item }: { item: IMasterKeyEntity }) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const form = useForm<UpdateMasterKeyForm>({
    resolver: zodResolver(UpdateMasterKeySchema) as Resolver<UpdateMasterKeyForm>,
    mode: "onChange",
    defaultValues: {
      key: item.key ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const handleFormSubmit = handleSubmit(async (data) => {
    const parsed = UpdateMasterKeySchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return;
    }

    const toastId = toast.loading("Actualizando llave maestra...");
    try {
      const payload: IUpdateMasterKeyParamsEntity = {
        key: parsed.data.key || undefined,
      };

      const result = await updateMasterKeyAction(item.id, payload);
      if (!result.success || !result.data?.success) {
        toast.error(result.error || "Error al actualizar la llave", { id: toastId });
        return;
      }

      toast.success("Llave maestra actualizada correctamente", { id: toastId });
      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Error updating master key:", error);
      toast.error("Error inesperado al actualizar la llave", { id: toastId });
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
      <Controller
        control={control}
        name="key"
        render={({ field, fieldState }) => (
          <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
            <ChronoFieldLabel htmlFor="key" className={fieldLabelClasses}>
              Código de la llave
            </ChronoFieldLabel>
            <ChronoInput {...field} id="key" placeholder="Ej: MK-001" className="mt-1" />
            {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
          </ChronoField>
        )}
      />

      <div className="flex justify-end gap-2">
        <ChronoButton icon={<X />} type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting} size={"lg"}>
          Cancelar
        </ChronoButton>
        <ChronoButton type="submit" loading={isSubmitting} icon={<Save />} disabled={!isValid || isSubmitting} size={"lg"}>
          Guardar cambios
        </ChronoButton>
      </div>
    </form>
  );
}
