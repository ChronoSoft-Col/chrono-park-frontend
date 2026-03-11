"use client";

import * as React from "react";
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

import type { IRoleEntity, IActionGroupEntity } from "@/server/domain";
import {
  UpdateRoleForm,
  UpdateRoleSchema,
} from "@/src/shared/schemas/auth/role.schema";
import { ActionsTree } from "./actions-tree/actions-tree.component";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type Props = {
  role: IRoleEntity;
  currentActionIds: string[];
  onSubmit: (data: UpdateRoleForm, actionIds: string[]) => Promise<boolean>;
  onCancel?: () => void;
  actionGroups: IActionGroupEntity[];
};

export function EditRoleFormComponent({
  role,
  currentActionIds,
  onSubmit,
  onCancel,
  actionGroups,
}: Props) {
  const [selectedActionIds, setSelectedActionIds] =
    React.useState<string[]>(currentActionIds);

  const form = useForm<UpdateRoleForm>({
    resolver: zodResolver(UpdateRoleSchema) as Resolver<UpdateRoleForm>,
    mode: "onChange",
    defaultValues: {
      name: role.name,
      description: role.description ?? "",
      isActive: role.isActive,
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data, selectedActionIds);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
      <div className="grid gap-3 md:grid-cols-2">
        {/* name */}
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <ChronoField
              data-invalid={fieldState.invalid}
              className={fieldContainerClasses}
            >
              <ChronoFieldLabel htmlFor="name" className={fieldLabelClasses}>
                Nombre del rol
              </ChronoFieldLabel>
              <ChronoInput
                {...field}
                value={field.value ?? ""}
                id="name"
                placeholder="OPERADOR"
                className="mt-1"
              />
              {fieldState.invalid && (
                <ChronoFieldError errors={[fieldState.error]} />
              )}
            </ChronoField>
          )}
        />

        {/* description */}
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <ChronoField
              data-invalid={fieldState.invalid}
              className={fieldContainerClasses}
            >
              <ChronoFieldLabel
                htmlFor="description"
                className={fieldLabelClasses}
              >
                Descripción (opcional)
              </ChronoFieldLabel>
              <ChronoInput
                {...field}
                value={field.value ?? ""}
                id="description"
                placeholder="Descripción del rol"
                className="mt-1"
              />
              {fieldState.invalid && (
                <ChronoFieldError errors={[fieldState.error]} />
              )}
            </ChronoField>
          )}
        />
      </div>

      {/* Actions tree */}
      <div className="rounded-lg border border-border bg-card/80 p-4 shadow-sm">
        <p className="text-xs font-medium text-muted-foreground mb-3">
          Permisos
        </p>
        <ActionsTree
          actionGroups={actionGroups}
          selectedActionIds={selectedActionIds}
          onChange={setSelectedActionIds}
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
            size="lg"
          >
            Cancelar
          </ChronoButton>
        )}
        <ChronoButton
          type="submit"
          loading={isSubmitting}
          icon={<Save />}
          disabled={!isValid || isSubmitting}
          size="lg"
        >
          Guardar cambios
        </ChronoButton>
      </div>
    </form>
  );
}
