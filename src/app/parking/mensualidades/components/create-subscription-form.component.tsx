"use client";

import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save,
  X,
  Loader2,
  ChevronsUpDown,
  Check,
  CalendarIcon,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import ChronoButton from "@chrono/chrono-button.component";
import {
  ChronoField,
  ChronoFieldError,
  ChronoFieldLabel,
} from "@chrono/chrono-field.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import ChronoVehicleTypeSelect from "@chrono/chrono-vehicle-type-select.component";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/shared/components/ui/command";
import { Calendar } from "@/src/shared/components/ui/calendar";
import { Checkbox } from "@/src/shared/components/ui/checkbox";

import { useCommonStore } from "@/src/shared/stores/common.store";
import {
  CreateSubscriptionForm,
  CreateSubscriptionSchema,
} from "@/src/shared/schemas/parking/create-subscription.schema";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
import PermissionGuard from "@/src/shared/components/permission-guard.component";
import { MensualidadesAction } from "@/src/shared/enums/auth/permissions.enum";
import { usePermissionsContext } from "@/src/shared/context/permissions.context";
import listCustomersAction from "@/src/app/parking/clientes/actions/list-customers.action";
import { getMonthlyPlansByVehicleTypeAction } from "../actions/monthly-plans.action";
import { IMonthlyPlanEntity } from "@/server/domain";
import { ICustomerVehicleEntity } from "@/server/domain/entities/parking/customers/customer.entity";

const fieldContainerClasses =
  "rounded-lg border border-border bg-card/80 p-4 shadow-sm transition-colors focus-within:border-primary data-[invalid=true]:border-destructive min-w-0";

const fieldLabelClasses = "text-xs font-medium text-muted-foreground";

type CustomerOption = {
  id: string;
  name: string;
  documentNumber: string;
  vehicles: ICustomerVehicleEntity[];
};

type Props = {
  onSubmit: (data: CreateSubscriptionForm) => Promise<boolean>;
  onCancel?: () => void;
};

export function CreateSubscriptionFormComponent({ onSubmit, onCancel }: Props) {
  const { vehicleTypes } = useCommonStore();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [monthlyPlans, setMonthlyPlans] = useState<IMonthlyPlanEntity[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerOption | null>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<
    ICustomerVehicleEntity[]
  >([]);
  const [customerPopoverOpen, setCustomerPopoverOpen] = useState(false);
  const [startDatePopoverOpen, setStartDatePopoverOpen] = useState(false);
  const [endDatePopoverOpen, setEndDatePopoverOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<CreateSubscriptionForm>({
    resolver: zodResolver(
      CreateSubscriptionSchema,
    ) as Resolver<CreateSubscriptionForm>,
    mode: "onChange",
    defaultValues: {
      customerId: "",
      monthlyPlanId: "",
      vehicleId: "",
      startDate: "",
      endDate: "",
      vehicleTypeRestricted: false,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
  } = form;

  // Buscar clientes
  const searchCustomers = useCallback(async (search: string) => {
    if (search.length < 2) {
      setCustomers([]);
      return;
    }

    setLoadingCustomers(true);
    try {
      const response = await listCustomersAction({ search, limit: "10" });
      if (response.success && response.data?.data?.items) {
        const customerList = response.data.data.items;
        setCustomers(
          customerList.map((c) => ({
            id: c.id,
            name: `${c.firstName} ${c.lastName}`,
            documentNumber: c.documentNumber,
            vehicles: c.vehicles || [],
          })),
        );
      }
    } catch (error) {
      console.error("Error searching customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  // Debounce para búsqueda de clientes en el Command
  const handleCustomerSearchChange = useCallback(
    (value: string) => {
      setCustomerSearch(value);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        searchCustomers(value);
      }, 500);
    },
    [searchCustomers],
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Cargar planes cuando cambia el tipo de vehículo
  useEffect(() => {
    if (selectedVehicleType) {
      setLoadingPlans(true);
      getMonthlyPlansByVehicleTypeAction(selectedVehicleType)
        .then((response) => {
          if (response.success && response.data?.data) {
            setMonthlyPlans(
              Array.isArray(response.data.data) ? response.data.data : [],
            );
          } else {
            setMonthlyPlans([]);
          }
        })
        .finally(() => setLoadingPlans(false));
    } else {
      setMonthlyPlans([]);
    }
    // Limpiar selección de plan cuando cambia el tipo
    setValue("monthlyPlanId", "");
  }, [selectedVehicleType, setValue]);

  // Filtrar vehículos del cliente por tipo de vehículo seleccionado
  useEffect(() => {
    if (selectedCustomer && selectedVehicleType) {
      const vehicles = selectedCustomer.vehicles.filter(
        (v) => v.vehicleTypeId === selectedVehicleType && v.isActive,
      );
      setFilteredVehicles(vehicles);
    } else if (selectedCustomer) {
      setFilteredVehicles(selectedCustomer.vehicles.filter((v) => v.isActive));
    } else {
      setFilteredVehicles([]);
    }
    // Limpiar selección de vehículo cuando cambia el filtro
    setValue("vehicleId", "");
  }, [selectedCustomer, selectedVehicleType, setValue]);

  // Actualizar cliente seleccionado cuando cambia customerId
  const handleCustomerChange = (customerId: string) => {
    setValue("customerId", customerId);
    const customer = customers.find((c) => c.id === customerId);
    setSelectedCustomer(customer || null);
  };

  const { can } = usePermissionsContext();
  const canCustomizeDates = can(MensualidadesAction.PERSONALIZAR_FECHA_MENSUALIDAD);

  const handleFormSubmit = handleSubmit(async (data) => {
    // Limpiar campos opcionales vacíos
    const cleanData = {
      ...data,
      vehicleId: data.vehicleId || undefined,
      startDate: canCustomizeDates ? (data.startDate || undefined) : undefined,
      endDate: canCustomizeDates ? (data.endDate || undefined) : undefined,
    };
    await onSubmit(cleanData);
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
      {/* Customer Section */}
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Seleccionar Cliente
        </ChronoSectionLabel>

        <Controller
          control={control}
          name="customerId"
          render={({ field, fieldState }) => (
            <ChronoField
              data-invalid={fieldState.invalid}
              className={fieldContainerClasses}
            >
              <ChronoFieldLabel
                htmlFor="customerId"
                className={fieldLabelClasses}
              >
                Cliente
              </ChronoFieldLabel>

              <Popover
                open={customerPopoverOpen}
                onOpenChange={setCustomerPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    role="combobox"
                    aria-expanded={customerPopoverOpen}
                    className="mt-1 flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {selectedCustomer
                      ? `${selectedCustomer.name} - ${selectedCustomer.documentNumber}`
                      : "Buscar cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Buscar por nombre o documento..."
                      value={customerSearch}
                      onValueChange={handleCustomerSearchChange}
                    />
                    <CommandList>
                      {loadingCustomers && (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          <span className="ml-2 text-xs text-muted-foreground">
                            Buscando...
                          </span>
                        </div>
                      )}
                      {!loadingCustomers && customerSearch.length < 2 && (
                        <CommandEmpty>
                          Escribe al menos 2 caracteres para buscar
                        </CommandEmpty>
                      )}
                      {!loadingCustomers &&
                        customerSearch.length >= 2 &&
                        customers.length === 0 && (
                          <CommandEmpty>
                            No se encontraron clientes
                          </CommandEmpty>
                        )}
                      {!loadingCustomers && customers.length > 0 && (
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.id}
                              onSelect={() => {
                                handleCustomerChange(customer.id);
                                setCustomerPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  field.value === customer.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {customer.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {customer.documentNumber} •{" "}
                                  {customer.vehicles.length} vehículo(s)
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {fieldState.invalid && (
                <ChronoFieldError errors={[fieldState.error]} />
              )}
            </ChronoField>
          )}
        />
      </div>

      <ChronoSeparator />

      {/* Plan Section */}
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Plan Mensual
        </ChronoSectionLabel>

        <div className="grid gap-3 md:grid-cols-2">
          <ChronoField className={fieldContainerClasses}>
            <ChronoFieldLabel
              htmlFor="vehicleTypeFilter"
              className={fieldLabelClasses}
            >
              Tipo de vehículo
            </ChronoFieldLabel>
            <ChronoVehicleTypeSelect
              value={selectedVehicleType}
              onValueChange={setSelectedVehicleType}
              options={vehicleTypes.map((vt) => ({
                value: vt.value,
                label: vt.label,
              }))}
              className="mt-1"
            />
          </ChronoField>

          <Controller
            control={control}
            name="monthlyPlanId"
            render={({ field, fieldState }) => (
              <ChronoField
                data-invalid={fieldState.invalid}
                className={fieldContainerClasses}
              >
                <ChronoFieldLabel
                  htmlFor="monthlyPlanId"
                  className={fieldLabelClasses}
                >
                  Plan mensual
                </ChronoFieldLabel>

                <ChronoSelect
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={loadingPlans || monthlyPlans.length === 0}
                >
                  <ChronoSelectTrigger className="mt-1 text-left">
                    <ChronoSelectValue
                      placeholder={
                        loadingPlans
                          ? "Cargando..."
                          : monthlyPlans.length === 0
                            ? "Seleccione tipo de vehículo primero"
                            : "Seleccionar plan"
                      }
                    />
                  </ChronoSelectTrigger>
                  <ChronoSelectContent>
                    {monthlyPlans.map((plan) => (
                      <ChronoSelectItem key={plan.id} value={plan.id}>
                        {plan.name} - {formatPrice(plan.price)}
                      </ChronoSelectItem>
                    ))}
                  </ChronoSelectContent>
                </ChronoSelect>

                {fieldState.invalid && (
                  <ChronoFieldError errors={[fieldState.error]} />
                )}
              </ChronoField>
            )}
          />
        </div>
      </div>

      <ChronoSeparator />

      {/* Date Range Section (Optional) – only visible with PERSONALIZAR_FECHA_MENSUALIDAD */}
      <PermissionGuard action={MensualidadesAction.PERSONALIZAR_FECHA_MENSUALIDAD} hidden>
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Fechas (Opcional)
        </ChronoSectionLabel>

        <div className="grid gap-3 md:grid-cols-2">
          <Controller
            control={control}
            name="startDate"
            render={({ field, fieldState }) => (
              <ChronoField
                data-invalid={fieldState.invalid}
                className={fieldContainerClasses}
              >
                <ChronoFieldLabel
                  htmlFor="startDate"
                  className={fieldLabelClasses}
                >
                  Fecha de inicio
                </ChronoFieldLabel>
                <Popover
                  open={startDatePopoverOpen}
                  onOpenChange={setStartDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="mt-1 flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {field.value ? (
                        format(
                          new Date(field.value + "T00:00:00"),
                          "dd/MM/yyyy",
                          { locale: es },
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          Seleccionar fecha inicio
                        </span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value
                          ? new Date(field.value + "T00:00:00")
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(format(date, "yyyy-MM-dd"));
                        } else {
                          field.onChange("");
                        }
                        setStartDatePopoverOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <ChronoFieldError errors={[fieldState.error]} />
                )}
              </ChronoField>
            )}
          />

          <Controller
            control={control}
            name="endDate"
            render={({ field, fieldState }) => (
              <ChronoField
                data-invalid={fieldState.invalid}
                className={fieldContainerClasses}
              >
                <ChronoFieldLabel
                  htmlFor="endDate"
                  className={fieldLabelClasses}
                >
                  Fecha de fin
                </ChronoFieldLabel>
                <Popover
                  open={endDatePopoverOpen}
                  onOpenChange={setEndDatePopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="mt-1 flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {field.value ? (
                        format(
                          new Date(field.value + "T00:00:00"),
                          "dd/MM/yyyy",
                          { locale: es },
                        )
                      ) : (
                        <span className="text-muted-foreground">
                          Seleccionar fecha fin
                        </span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value
                          ? new Date(field.value + "T00:00:00")
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(format(date, "yyyy-MM-dd"));
                        } else {
                          field.onChange("");
                        }
                        setEndDatePopoverOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {fieldState.invalid && (
                  <ChronoFieldError errors={[fieldState.error]} />
                )}
              </ChronoField>
            )}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Las fechas son opcionales. Formato esperado: YYYY-MM-DD.
        </p>
      </div>
      </PermissionGuard>

      <ChronoSeparator />

      {/* Vehicle Type Restriction */}
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Restricciones
        </ChronoSectionLabel>

        <Controller
          control={control}
          name="vehicleTypeRestricted"
          render={({ field }) => (
            <ChronoField className={fieldContainerClasses}>
              <div className="flex items-center gap-3">
                <Checkbox
                  id="vehicleTypeRestricted"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(Boolean(checked))
                  }
                />
                <ChronoFieldLabel
                  htmlFor="vehicleTypeRestricted"
                  className="text-sm font-medium cursor-pointer select-none"
                >
                  Restricción por tipo de vehículo
                </ChronoFieldLabel>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Si se activa, la suscripción estará restringida al tipo de
                vehículo seleccionado.
              </p>
            </ChronoField>
          )}
        />
      </div>

      <ChronoSeparator />

      {/* Vehicle Section (Optional) */}
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Vehículo (Opcional)
        </ChronoSectionLabel>

        <div className="grid gap-3 md:grid-cols-2">
          <Controller
            control={control}
            name="vehicleId"
            render={({ field, fieldState }) => (
              <ChronoField
                data-invalid={fieldState.invalid}
                className={fieldContainerClasses}
              >
                <ChronoFieldLabel
                  htmlFor="vehicleId"
                  className={fieldLabelClasses}
                >
                  Vehículo del cliente
                </ChronoFieldLabel>
                <ChronoSelect
                  onValueChange={field.onChange}
                  value={field.value ?? ""}
                  disabled={!selectedCustomer || filteredVehicles.length === 0}
                >
                  <ChronoSelectTrigger className="mt-1 text-left">
                    <ChronoSelectValue
                      placeholder={
                        !selectedCustomer
                          ? "Seleccione un cliente primero"
                          : filteredVehicles.length === 0
                            ? "No hay vehículos disponibles"
                            : "Seleccionar vehículo (opcional)"
                      }
                    />
                  </ChronoSelectTrigger>
                  <ChronoSelectContent>
                    {filteredVehicles.map((vehicle) => (
                      <ChronoSelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.licensePlate} - {vehicle.vehicleTypeName}
                      </ChronoSelectItem>
                    ))}
                  </ChronoSelectContent>
                </ChronoSelect>
                {fieldState.invalid && (
                  <ChronoFieldError errors={[fieldState.error]} />
                )}
              </ChronoField>
            )}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          El vehículo es opcional. Solo se muestran vehículos activos del
          cliente
          {selectedVehicleType
            ? " que coinciden con el tipo de vehículo seleccionado"
            : ""}
          .
        </p>
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
          Crear Suscripción
        </ChronoButton>
      </div>
    </form>
  );
}
