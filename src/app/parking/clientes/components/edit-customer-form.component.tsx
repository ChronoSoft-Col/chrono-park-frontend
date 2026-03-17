"use client";

import { useEffect } from "react";
import { Controller, type Resolver, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2, X } from "lucide-react";

import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoField,
  ChronoFieldError,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import { ChronoInput } from "@chrono/chrono-input.component";
import ChronoPlateInput from "@chrono/chrono-plate-input.component";
import ChronoVehicleTypeSelect from "@chrono/chrono-vehicle-type-select.component";

import type { ICustomerEntity } from "@/server/domain";
import {
  UpdateCustomerForm,
  UpdateCustomerSchema,
} from "@/src/shared/schemas/parking/update-customer.schema";
import { useCommonStore } from "@/src/shared/stores/common.store";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type Props = {
  customer: ICustomerEntity;
  onSubmit: (data: UpdateCustomerForm) => Promise<boolean>;
  onCancel?: () => void;
};

export function EditCustomerFormComponent({ customer, onSubmit, onCancel }: Props) {
  const { vehicleTypes } = useCommonStore();

  const form = useForm<UpdateCustomerForm>({
    resolver: zodResolver(UpdateCustomerSchema) as Resolver<UpdateCustomerForm>,
    mode: "onChange",
    defaultValues: {
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      email: customer.email ?? "",
      phoneNumber: customer.phoneNumber ?? "",
      agreementId: customer.agreementId ?? "",
      vehicles: (customer.vehicles ?? []).map((v) => ({
        licensePlate: v.licensePlate,
        vehicleTypeId: v.vehicleTypeId,
      })),
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicles",
  });

  // When the dialog loads the full customer by ID, refresh the form values
  // (but don't clobber user edits if they've already started typing).
  useEffect(() => {
    if (isDirty) return;

    reset({
      firstName: customer.firstName ?? "",
      lastName: customer.lastName ?? "",
      email: customer.email ?? "",
      phoneNumber: customer.phoneNumber ?? "",
      agreementId: customer.agreementId ?? "",
      vehicles: (customer.vehicles ?? []).map((v) => ({
        licensePlate: v.licensePlate,
        vehicleTypeId: v.vehicleTypeId,
      })),
    });
  }, [customer, isDirty, reset]);

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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Vehículos</p>
            <p className="text-xs text-muted-foreground">Agrega, edita o quita vehículos del cliente.</p>
          </div>

          <ChronoButton
            type="button"
            variant="outline"
            onClick={() => append({ licensePlate: "", vehicleTypeId: "" })}
            icon={<Plus className="h-4 w-4" />}
          >
            Agregar
          </ChronoButton>
        </div>

        <div className="space-y-3">
          {fields.length === 0 && (
            <div className="rounded-lg border border-border bg-card/50 p-3 text-xs text-muted-foreground">
              Este cliente no tiene vehículos asociados.
            </div>
          )}

          {fields.map((row, index) => (
            <div key={row.id} className="grid gap-3 md:grid-cols-2">
              <Controller
                control={control}
                name={`vehicles.${index}.licensePlate`}
                render={({ field, fieldState }) => (
                  <ChronoField
                    data-invalid={fieldState.invalid}
                    className={fieldContainerClasses}
                  >
                    <ChronoFieldLabel
                      htmlFor={`vehicles.${index}.licensePlate`}
                      className={fieldLabelClasses}
                    >
                      Placa
                    </ChronoFieldLabel>
                    <ChronoPlateInput
                      {...field}
                      id={`vehicles.${index}.licensePlate`}
                      value={(field.value as string) ?? ""}
                      placeholder="Placa"
                      className="mt-1"
                    />
                    {fieldState.invalid && (
                      <ChronoFieldError errors={[fieldState.error]} />
                    )}
                  </ChronoField>
                )}
              />

              <Controller
                control={control}
                name={`vehicles.${index}.vehicleTypeId`}
                render={({ field, fieldState }) => (
                  <ChronoField
                    data-invalid={fieldState.invalid}
                    className={fieldContainerClasses}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <ChronoFieldLabel
                        htmlFor={`vehicles.${index}.vehicleTypeId`}
                        className={fieldLabelClasses}
                      >
                        Tipo de vehículo
                      </ChronoFieldLabel>
                      <ChronoButton
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        icon={<Trash2 className="h-4 w-4" />}
                      />
                    </div>

                    <ChronoVehicleTypeSelect
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={vehicleTypes}
                      className="mt-1"
                    />

                    {fieldState.invalid && (
                      <ChronoFieldError errors={[fieldState.error]} />
                    )}
                  </ChronoField>
                )}
              />
            </div>
          ))}
        </div>
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
