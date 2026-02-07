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
import ChronoPlateInput from "@chrono/chrono-plate-input.component";
import ChronoVehicleTypeSelect from "@chrono/chrono-vehicle-type-select.component";

import { useCommonContext } from "@/src/shared/context/common.context";
import {
  CreateSubscriptionForm,
  CreateSubscriptionSchema,
} from "@/src/shared/schemas/parking/create-subscription.schema";
import { useState, useEffect } from "react";
import { getRateProfileAction } from "@/src/app/global-actions/get-common.action";
import { TRateProfile } from "@/src/shared/types/common/rate-profile.type";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type Props = {
  onSubmit: (data: CreateSubscriptionForm) => Promise<boolean>;
  onCancel?: () => void;
};

export function CreateSubscriptionFormComponent({ onSubmit, onCancel }: Props) {
  const { vehicleTypes = [], documentTypes = [] } = useCommonContext();
  const [rateProfiles, setRateProfiles] = useState<TRateProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const form = useForm<CreateSubscriptionForm>({
    resolver: zodResolver(CreateSubscriptionSchema) as Resolver<CreateSubscriptionForm>,
    mode: "onChange",
    defaultValues: {
      startDate: "",
      endDate: "",
      rateProfileId: "",
      customer: {
        id: undefined,
        documentTypeId: "",
        documentNumber: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
      },
      vehicle: {
        id: undefined,
        licensePlate: "",
        vehicleTypeId: "",
      },
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid },
  } = form;

  const vehicleTypeId = watch("vehicle.vehicleTypeId");

  useEffect(() => {
    if (vehicleTypeId) {
      setLoadingProfiles(true);
      getRateProfileAction(vehicleTypeId)
        .then((response) => {
          if (response.success && response.data?.data) {
            setRateProfiles(
              Array.isArray(response.data.data)
                ? response.data.data
                : [response.data.data]
            );
          }
        })
        .finally(() => setLoadingProfiles(false));
    } else {
      setRateProfiles([]);
    }
  }, [vehicleTypeId]);

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
      {/* Customer Section */}
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Datos del Cliente
        </ChronoSectionLabel>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Controller
            control={control}
            name="customer.documentTypeId"
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
            name="customer.documentNumber"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="documentNumber" className={fieldLabelClasses}>
                  Número de documento
                </ChronoFieldLabel>
                <ChronoInput
                  {...field}
                  id="documentNumber"
                  placeholder="123456789"
                  className="mt-1"
                />
                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />

          <Controller
            control={control}
            name="customer.firstName"
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
            name="customer.lastName"
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
            name="customer.email"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="email" className={fieldLabelClasses}>
                  Email (opcional)
                </ChronoFieldLabel>
                <ChronoInput
                  {...field}
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  className="mt-1"
                />
                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />

          <Controller
            control={control}
            name="customer.phoneNumber"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="phoneNumber" className={fieldLabelClasses}>
                  Teléfono (opcional)
                </ChronoFieldLabel>
                <ChronoInput
                  {...field}
                  id="phoneNumber"
                  placeholder="3001234567"
                  className="mt-1"
                />
                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />
        </div>
      </div>

      <ChronoSeparator />

      {/* Vehicle Section */}
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Datos del Vehículo
        </ChronoSectionLabel>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Controller
            control={control}
            name="vehicle.licensePlate"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="licensePlate" className={fieldLabelClasses}>
                  Placa
                </ChronoFieldLabel>
                <ChronoPlateInput
                  {...field}
                  id="licensePlate"
                  placeholder="ABC123"
                  className="mt-1"
                />
                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />

          <Controller
            control={control}
            name="vehicle.vehicleTypeId"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="vehicleTypeId" className={fieldLabelClasses}>
                  Tipo de vehículo
                </ChronoFieldLabel>
                <ChronoVehicleTypeSelect
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  options={vehicleTypes.map((vt) => ({ value: vt.value, label: vt.label }))}
                  className="mt-1"
                />
                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />
        </div>
      </div>

      <ChronoSeparator />

      {/* Subscription Section */}
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Datos de la Mensualidad
        </ChronoSectionLabel>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <Controller
            control={control}
            name="rateProfileId"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="rateProfileId" className={fieldLabelClasses}>
                  Perfil de tarifa
                </ChronoFieldLabel>

                <ChronoSelect
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={loadingProfiles || rateProfiles.length === 0}
                >
                  <ChronoSelectTrigger className="mt-1 text-left">
                    <ChronoSelectValue
                      placeholder={
                        loadingProfiles
                          ? "Cargando..."
                          : rateProfiles.length === 0
                          ? "Seleccione tipo de vehículo primero"
                          : "Seleccionar tarifa"
                      }
                    />
                  </ChronoSelectTrigger>
                  <ChronoSelectContent>
                    {rateProfiles.map((profile) => (
                      <ChronoSelectItem key={profile.id} value={profile.id}>
                        {profile.name}
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
            name="startDate"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="startDate" className={fieldLabelClasses}>
                  Fecha de inicio
                </ChronoFieldLabel>
                <ChronoInput
                  {...field}
                  id="startDate"
                  type="date"
                  className="mt-1"
                />
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
                  Fecha de vencimiento
                </ChronoFieldLabel>
                <ChronoInput
                  {...field}
                  id="endDate"
                  type="date"
                  className="mt-1"
                />
                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
        {onCancel && (
          <ChronoButton
            type="button"
            variant="outline"
            onClick={onCancel}
            icon={<X className="h-4 w-4" />}
            iconPosition="left"
            size="lg"
          >
            Cancelar
          </ChronoButton>
        )}

        <ChronoButton
          type="submit"
          disabled={!isValid || isSubmitting}
          loading={isSubmitting}
          icon={<Save className="h-4 w-4" />}
          iconPosition="left"
          size="lg"
        >
          Guardar Mensualidad
        </ChronoButton>
      </div>
    </form>
  );
}
