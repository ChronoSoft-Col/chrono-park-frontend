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
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";

import { useCommonStore } from "@/src/shared/stores/common.store";
import {
  CreateUserForm,
  CreateUserSchema,
} from "@/src/shared/schemas/auth/user.schema";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type Props = {
  onSubmit: (data: CreateUserForm) => Promise<boolean>;
  onCancel?: () => void;
  roles: { value: string; label: string }[];
};

export function CreateUserFormComponent({ onSubmit, onCancel, roles }: Props) {
  const { documentTypes } = useCommonStore();

  const form = useForm<CreateUserForm>({
    resolver: zodResolver(CreateUserSchema) as Resolver<CreateUserForm>,
    mode: "onChange",
    defaultValues: {
      email: "",
      documentNumber: "",
      firstName: "",
      lastName: "",
      password: "",
      documentTypeId: "",
      roleId: "",
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
      <div className="grid gap-3 md:grid-cols-2">
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
                Email
              </ChronoFieldLabel>
              <ChronoInput {...field} id="email" type="email" placeholder="correo@dominio.com" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="password" className={fieldLabelClasses}>
                Contraseña
              </ChronoFieldLabel>
              <ChronoInput {...field} id="password" type="password" placeholder="••••••" className="mt-1" />
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />

        <Controller
          control={control}
          name="documentTypeId"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
              <ChronoFieldLabel htmlFor="documentTypeId" className={fieldLabelClasses}>
                Tipo de documento
              </ChronoFieldLabel>
              <ChronoSelect
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={documentTypes.length === 0}
              >
                <ChronoSelectTrigger className="mt-1 text-left">
                  <ChronoSelectValue placeholder={documentTypes.length === 0 ? "Cargando..." : "Seleccionar tipo"} />
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
          name="roleId"
          render={({ field, fieldState }) => (
            <ChronoField data-invalid={fieldState.invalid} className={`${fieldContainerClasses} md:col-span-2`}>
              <ChronoFieldLabel htmlFor="roleId" className={fieldLabelClasses}>
                Rol
              </ChronoFieldLabel>
              <ChronoSelect
                onValueChange={field.onChange}
                value={field.value ?? ""}
                disabled={roles.length === 0}
              >
                <ChronoSelectTrigger className="mt-1 text-left">
                  <ChronoSelectValue placeholder={roles.length === 0 ? "Cargando..." : "Seleccionar rol"} />
                </ChronoSelectTrigger>
                <ChronoSelectContent>
                  {roles.map((role) => (
                    <ChronoSelectItem key={role.value} value={role.value}>
                      {role.label}
                    </ChronoSelectItem>
                  ))}
                </ChronoSelectContent>
              </ChronoSelect>
              {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
            </ChronoField>
          )}
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <ChronoButton icon={<X />} type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} size="lg">
            Cancelar
          </ChronoButton>
        )}
        <ChronoButton type="submit" loading={isSubmitting} icon={<Save />} disabled={!isValid || isSubmitting} size="lg">
          Crear usuario
        </ChronoButton>
      </div>
    </form>
  );
}
