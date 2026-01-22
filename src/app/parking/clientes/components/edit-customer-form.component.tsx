"use client";

import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoField,
  ChronoFieldError,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import { ChronoInput } from "@chrono/chrono-input.component";

import type { ICustomerEntity } from "@/server/domain";
import {
  UpdateCustomerForm,
  UpdateCustomerSchema,
} from "@/src/shared/schemas/parking/update-customer.schema";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type Props = {
  customer: ICustomerEntity;
  onSubmit: (data: UpdateCustomerForm) => Promise<boolean>;
  onCancel?: () => void;
};

export function EditCustomerFormComponent({ customer, onSubmit, onCancel }: Props) {
  const form = useForm<UpdateCustomerForm>({
    resolver: zodResolver(UpdateCustomerSchema) as Resolver<UpdateCustomerForm>,
    mode: "onChange",
    defaultValues: {
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      email: customer.email ?? "",
      phoneNumber: customer.phoneNumber ?? "",
      agreementId: customer.agreementId ?? "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="firstName" className={fieldLabelClasses}>
                Nombre
              </ChronoFieldLabel>
              <ChronoInput {...field} id="firstName" placeholder="Juan" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="lastName" className={fieldLabelClasses}>
                Apellido
              </ChronoFieldLabel>
              <ChronoInput {...field} id="lastName" placeholder="Pérez" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="email" className={fieldLabelClasses}>
                Email (opcional)
              </ChronoFieldLabel>
              <ChronoInput {...field} id="email" placeholder="correo@dominio.com" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="phoneNumber" className={fieldLabelClasses}>
                Teléfono (opcional)
              </ChronoFieldLabel>
              <ChronoInput {...field} id="phoneNumber" placeholder="3000000000" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="agreementId"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={`${fieldContainerClasses} md:col-span-2 xl:col-span-3`}>
              <ChronoFieldLabel htmlFor="agreementId" className={fieldLabelClasses}>
                Convenio (opcional)
              </ChronoFieldLabel>
              <ChronoInput {...field} id="agreementId" placeholder="ID de convenio" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <ChronoButton
            icon={<X />}
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            size={"lg"}
          >
            Cancelar
          </ChronoButton>
        )}
        <ChronoButton
          type="submit"
          loading={isSubmitting}
          icon={<Save />}
          disabled={!isValid || isSubmitting}
          size={"lg"}
        >
          Guardar cambios
        </ChronoButton>
      </div>
    </form>
  );
}
