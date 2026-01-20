"use client";

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
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import ChronoPlateInput from "@chrono/chrono-plate-input.component";
import ChronoVehicleTypeSelect from "@chrono/chrono-vehicle-type-select.component";

import { useCommonContext } from "@/src/shared/context/common.context";
import {
  CreateCustomerForm,
  CreateCustomerSchema,
} from "@/src/shared/schemas/parking/create-customer.schema";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type Props = {
  onSubmit: (data: CreateCustomerForm) => Promise<boolean>;
  onCancel?: () => void;
};

export function CreateCustomerFormComponent({ onSubmit, onCancel }: Props) {
  const { vehicleTypes = [], documentTypes = [] } = useCommonContext();

  const form = useForm<CreateCustomerForm>({
    resolver: zodResolver(CreateCustomerSchema) as Resolver<CreateCustomerForm>,
    mode: "onChange",
    defaultValues: {
      documentTypeId: "",
      documentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      agreementId: "",
      vehicles: [{ licensePlate: "", vehicleTypeId: "" }],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicles",
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <Controller
          control={control}
          name="documentTypeId"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="documentTypeId" className={fieldLabelClasses}>
                Tipo de documento
              </ChronoFieldLabel>

              <ChronoSelect onValueChange={field.onChange} value={field.value ?? ""}>
                <ChronoSelectTrigger className="mt-1 text-left">
                  <ChronoSelectValue placeholder="Seleccionar tipo" />
                </ChronoSelectTrigger>
                <ChronoSelectContent>
                  {documentTypes.map((type) => (
                    <ChronoSelectItem key={type.value} value={type.value}>
                      {type.label}
                    </ChronoSelectItem>
                  ))}
                </ChronoSelectContent>
              </ChronoSelect>

              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="documentNumber"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="documentNumber" className={fieldLabelClasses}>
                Número de documento
              </ChronoFieldLabel>
              <ChronoInput {...field} id="documentNumber" placeholder="123456789" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

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
            <ChronoField
              data-invalid={fieldState.invalid}
              className={`${fieldContainerClasses} md:col-span-2 xl:col-span-3`}
            >
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
            <p className="text-xs text-muted-foreground">
              Agrega placas y tipo de vehículo (dos campos por registro).
            </p>
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
          {fields.map((row, index) => (
            <div key={row.id} className="grid gap-3 md:grid-cols-2">
              <Controller
                control={control}
                name={`vehicles.${index}.licensePlate`}
                render={({ field, fieldState }) => (
                  <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
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
                    {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
                  </ChronoField>
                )}
              />

              <Controller
                control={control}
                name={`vehicles.${index}.vehicleTypeId`}
                render={({ field, fieldState }) => (
                  <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                    <div className="flex items-start justify-between gap-2">
                      <ChronoFieldLabel
                        htmlFor={`vehicles.${index}.vehicleTypeId`}
                        className={fieldLabelClasses}
                      >
                        Tipo de vehículo
                      </ChronoFieldLabel>
                      {fields.length > 1 && (
                        <ChronoButton
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          icon={<Trash2 className="h-4 w-4" />}
                        />
                      )}
                    </div>

                    <ChronoVehicleTypeSelect
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      options={vehicleTypes}
                      className="mt-1"
                    />

                    {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
                  </ChronoField>
                )}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <ChronoButton icon={<X />} type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} size={"lg"}>

            Cancelar
          </ChronoButton>
        )}
        <ChronoButton type="submit" loading={isSubmitting} icon={<Save />} disabled={!isValid || isSubmitting} size={"lg"}>
          Crear cliente
        </ChronoButton>
      </div>
    </form>
  );
}
