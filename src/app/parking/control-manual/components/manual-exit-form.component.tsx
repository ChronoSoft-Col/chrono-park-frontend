"use client";

import { ChronoDateTimePicker } from "@chrono/chrono-date-time-picker.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoCard,
  ChronoCardContent,
  ChronoCardDescription,
  ChronoCardFooter,
  ChronoCardHeader,
  ChronoCardTitle,
} from "@chrono/chrono-card.component";
import {
  ChronoField,
  ChronoFieldError,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import { ChronoInput } from "@chrono/chrono-input.component";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Car,
  Clock,
  DoorOpen,
  Fingerprint,
  Hash,
  LoaderCircle,
  Search,
  ShieldX,
} from "lucide-react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateManualExitAction } from "../actions/generate-manual-exit.action";
import { IGenerateManualExitParamsEntity } from "@/server/domain";
import { IManualExitData } from "@/server/domain/entities/parking/manual-exit/response/generate-manual-exit-response.entity";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { IngresosSalidasAction } from "@/src/shared/enums/auth/permissions.enum";
import EmptyState from "@/src/shared/components/empty-state.component";
import {
  ManualExitForm,
  ManualExitSchema,
} from "@/shared/schemas/parking/manual-exit.schema";

export default function ManualExitFormComponent() {
  return (
    <PermissionGuard
      action={IngresosSalidasAction.EDITAR_INGRESOS_SALIDAS}
      fallback={
        <ChronoCard className="flex flex-col">
          <ChronoCardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <ChronoBadge variant="outline" className="text-[11px] font-medium text-muted-foreground">
                Control manual
              </ChronoBadge>
            </div>
            <div>
              <ChronoCardTitle className="text-2xl font-semibold text-foreground">
                Registrar salida manual
              </ChronoCardTitle>
              <ChronoCardDescription className="text-sm text-muted-foreground">
                No tienes permisos para registrar salidas manuales.
              </ChronoCardDescription>
            </div>
          </ChronoCardHeader>
          <ChronoCardContent className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={<ShieldX className="h-12 w-12 text-muted-foreground" />}
              title="Acceso restringido"
              description="Contacta a un administrador para obtener el permiso de registrar salidas manuales."
              className="py-10"
            />
          </ChronoCardContent>
        </ChronoCard>
      }
    >
      <ExitForm />
    </PermissionGuard>
  );
}

const hints = [
  { icon: Car, label: "Placa", example: "ABC123" },
  { icon: Fingerprint, label: "Cédula", example: "1234567890" },
  { icon: Hash, label: "Sesión", example: "UUID" },
];

const ExitForm = () => {
  const exitForm = useForm<ManualExitForm>({
    resolver: zodResolver(ManualExitSchema) as Resolver<ManualExitForm>,
    mode: "onTouched",
    defaultValues: {
      identifier: "",
      exitTime: undefined,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = exitForm;

  const handleFormSubmit = handleSubmit(async (data: ManualExitForm) => {
    const toastId = toast.loading("Registrando salida manual...");
    try {
      const params: IGenerateManualExitParamsEntity = {
        identifier: data.identifier.trim(),
        exitTime: data.exitTime?.toISOString(),
      };
      const response = await generateManualExitAction(params);
      if (!response.success) {
        toast.error("Error registrando salida: " + response.error, { id: toastId });
        return;
      }

      const exitData = (response.data as { data: IManualExitData })?.data;
      const message = exitData?.message || "Salida registrada correctamente";

      toast.success(message, { id: toastId });
      reset({ identifier: "", exitTime: undefined });
    } catch (error) {
      console.error("Error generating manual exit:", error);
      toast.error("Error inesperado al registrar salida", { id: toastId });
    }
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <ChronoCard>
        <ChronoCardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <ChronoBadge
              variant="outline"
              className="text-[11px] font-medium text-muted-foreground"
            >
              Control manual
            </ChronoBadge>
          </div>
          <div>
            <ChronoCardTitle className="text-2xl font-semibold text-foreground">
              Registrar salida manual
            </ChronoCardTitle>
            <ChronoCardDescription className="text-sm text-muted-foreground">
              Busca el vehículo para registrar su salida del estacionamiento.
            </ChronoCardDescription>
          </div>
        </ChronoCardHeader>

        <ChronoCardContent className="space-y-5">
          {/* Hero search input */}
          <Controller
            control={control}
            name="identifier"
            render={({ field, fieldState }) => (
              <div className="space-y-3">
                <div
                  className={`
                    flex items-center gap-3 rounded-xl border-2 bg-muted/30 px-4 py-3
                    transition-colors duration-200
                    ${fieldState.invalid ? "border-destructive/60" : "border-border/60"}
                    focus-within:border-primary focus-within:bg-muted/50
                  `}
                >
                  <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <ChronoInput
                    {...field}
                    id="identifier"
                    placeholder="Escribe la placa, cédula o ID..."
                    autoComplete="off"
                    className="border-0 bg-transparent px-0 text-base font-medium shadow-none focus-visible:ring-0 dark:bg-transparent placeholder:text-muted-foreground/60"
                  />
                </div>
                {fieldState.invalid && (
                  <ChronoFieldError errors={[fieldState.error]} />
                )}
                <div className="flex flex-wrap items-center gap-2">
                  {hints.map((hint) => (
                    <div
                      key={hint.label}
                      className="flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-2.5 py-1"
                    >
                      <hint.icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {hint.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">
                        {hint.example}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />

          {/* Optional exit time */}
          <Controller
            name="exitTime"
            control={control}
            render={({ field, fieldState }) => (
              <ChronoField
                data-invalid={fieldState.invalid}
                className="rounded-lg border border-border/60 bg-muted/20 p-4 transition-colors focus-within:border-primary/50 data-[invalid=true]:border-destructive/60"
              >
                <ChronoFieldLabel
                  htmlFor="exitTime"
                  className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                >
                  <Clock className="h-3.5 w-3.5" />
                  Fecha y hora de salida
                  <ChronoBadge variant="outline" className="ml-1 px-1.5 py-0 text-[9px] font-normal text-muted-foreground/70">
                    Opcional
                  </ChronoBadge>
                </ChronoFieldLabel>

                <ChronoDateTimePicker
                  date={field.value as Date | undefined}
                  setDate={(value) => field.onChange(value)}
                />

                {fieldState.invalid && (
                  <ChronoFieldError errors={[fieldState.error]} />
                )}
              </ChronoField>
            )}
          />
        </ChronoCardContent>

        <ChronoCardFooter className="flex-col gap-3 bg-muted/5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            Si no se especifica fecha, se usará la hora actual.
          </p>
          <ChronoButton
            type="submit"
            size="lg"
            disabled={isSubmitting || !isValid}
            className="w-full sm:w-auto sm:min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Procesando
              </>
            ) : (
              <>
                <DoorOpen className="h-4 w-4" />
                Registrar salida manual
              </>
            )}
          </ChronoButton>
        </ChronoCardFooter>
      </ChronoCard>
    </form>
  );
};
