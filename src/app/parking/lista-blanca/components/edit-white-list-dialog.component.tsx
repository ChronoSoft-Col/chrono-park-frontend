"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { updateWhiteListAction } from "../actions/update-white-list.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type { IWhiteListEntity, IUpdateWhiteListParamsEntity } from "@/server/domain";
import {
  UpdateWhiteListForm,
  UpdateWhiteListSchema,
} from "@/src/shared/schemas/parking/white-list.schema";

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

const toDateInputValue = (date?: string) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export function EditWhiteListDialogContent({ item }: { item: IWhiteListEntity }) {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const form = useForm<UpdateWhiteListForm>({
    resolver: zodResolver(UpdateWhiteListSchema) as Resolver<UpdateWhiteListForm>,
    mode: "onChange",
    defaultValues: {
      reason: item.reason ?? "",
      vehicleId: item.vehicleId ?? "",
      customerId: item.customerId ?? "",
      startDate: toDateInputValue(item.startDate),
      endDate: toDateInputValue(item.endDate),
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const handleFormSubmit = handleSubmit(async (data) => {
    const parsed = UpdateWhiteListSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return;
    }

    const toastId = toast.loading("Actualizando registro...");
    try {
      const payload: IUpdateWhiteListParamsEntity = {
        ...parsed.data,
        vehicleId: parsed.data.vehicleId || undefined,
        customerId: parsed.data.customerId || undefined,
        endDate: parsed.data.endDate || undefined,
        startDate: parsed.data.startDate || undefined,
        reason: parsed.data.reason || undefined,
      };

      const result = await updateWhiteListAction(item.id, payload);
      if (!result.success || !result.data?.success) {
        toast.error(result.error || "Error al actualizar el registro", { id: toastId });
        return;
      }

      toast.success("Registro actualizado correctamente", { id: toastId });
      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Error updating white list entry:", error);
      toast.error("Error inesperado al actualizar el registro", { id: toastId });
    }
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Controller
          control={control}
          name="vehicleId"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="vehicleId" className={fieldLabelClasses}>
                ID Vehículo (opcional)
              </ChronoFieldLabel>
              <ChronoInput {...field} id="vehicleId" placeholder="UUID del vehículo" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="customerId"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="customerId" className={fieldLabelClasses}>
                ID Cliente (opcional)
              </ChronoFieldLabel>
              <ChronoInput {...field} id="customerId" placeholder="UUID del cliente" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="reason"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={`${fieldContainerClasses} md:col-span-2`}>
              <ChronoFieldLabel htmlFor="reason" className={fieldLabelClasses}>
                Razón
              </ChronoFieldLabel>
              <ChronoInput {...field} id="reason" placeholder="Ej: Empleado, VIP" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="startDate"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="startDate" className={fieldLabelClasses}>
                Fecha de inicio
              </ChronoFieldLabel>
              <ChronoInput {...field} id="startDate" type="date" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="endDate" className={fieldLabelClasses}>
                Fecha de fin (opcional)
              </ChronoFieldLabel>
              <ChronoInput {...field} id="endDate" type="date" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />
      </div>

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
