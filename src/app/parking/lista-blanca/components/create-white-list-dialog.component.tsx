"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { createWhiteListAction } from "../actions/create-white-list.action";
import { UseDialogContext } from "@/shared/context/dialog.context";
import type { ICreateWhiteListParamsEntity } from "@/server/domain";
import {
  CreateWhiteListForm,
  CreateWhiteListSchema,
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

export function CreateWhiteListDialogContent() {
  const router = useRouter();
  const { closeDialog } = UseDialogContext();

  const form = useForm<CreateWhiteListForm>({
    resolver: zodResolver(CreateWhiteListSchema) as Resolver<CreateWhiteListForm>,
    mode: "onChange",
    defaultValues: {
      vehicleId: "",
      customerId: "",
      reason: "",
      startDate: "",
      endDate: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const handleFormSubmit = handleSubmit(async (data) => {
    const parsed = CreateWhiteListSchema.safeParse(data);
    if (!parsed.success) {
      toast.error("Revisa los campos del formulario");
      return;
    }

    const toastId = toast.loading("Creando registro...");
    try {
      const payload: ICreateWhiteListParamsEntity = {
        ...parsed.data,
        vehicleId: parsed.data.vehicleId || undefined,
        customerId: parsed.data.customerId || undefined,
        endDate: parsed.data.endDate || undefined,
      };

      const result = await createWhiteListAction(payload);
      if (!result.success || !result.data?.success) {
        toast.error(result.error || "Error al crear el registro", { id: toastId });
        return;
      }

      toast.success("Registro creado correctamente", { id: toastId });
      closeDialog();
      router.refresh();
    } catch (error) {
      console.error("Error creating white list entry:", error);
      toast.error("Error inesperado al crear el registro", { id: toastId });
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
          Crear registro
        </ChronoButton>
      </div>
    </form>
  );
}
