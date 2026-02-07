"use client";

import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X, Search, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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
import ChronoVehicleTypeSelect from "@chrono/chrono-vehicle-type-select.component";

import { useCommonContext } from "@/src/shared/context/common.context";
import {
  CreateSubscriptionForm,
  CreateSubscriptionSchema,
} from "@/src/shared/schemas/parking/create-subscription.schema";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoSeparator } from "@chrono/chrono-separator.component";
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
  const { vehicleTypes = [] } = useCommonContext();
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [monthlyPlans, setMonthlyPlans] = useState<IMonthlyPlanEntity[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedVehicleType, setSelectedVehicleType] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerOption | null>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<ICustomerVehicleEntity[]>([]);

  const form = useForm<CreateSubscriptionForm>({
    resolver: zodResolver(CreateSubscriptionSchema) as Resolver<CreateSubscriptionForm>,
    mode: "onChange",
    defaultValues: {
      customerId: "",
      monthlyPlanId: "",
      vehicleId: "",
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
      if (response.success && response.data?.data) {
        const customerList = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        setCustomers(
          customerList.map((c) => ({
            id: c.id,
            name: `${c.firstName} ${c.lastName}`,
            documentNumber: c.documentNumber,
            vehicles: c.vehicles || [],
          }))
        );
      }
    } catch (error) {
      console.error("Error searching customers:", error);
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  // Debounce para búsqueda de clientes
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCustomers(customerSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch, searchCustomers]);

  // Cargar planes cuando cambia el tipo de vehículo
  useEffect(() => {
    if (selectedVehicleType) {
      setLoadingPlans(true);
      getMonthlyPlansByVehicleTypeAction(selectedVehicleType)
        .then((response) => {
          if (response.success && response.data?.data) {
            setMonthlyPlans(
              Array.isArray(response.data.data) ? response.data.data : []
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
        (v) => v.vehicleTypeId === selectedVehicleType && v.isActive
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

  const handleFormSubmit = handleSubmit(async (data) => {
    // Limpiar vehicleId si está vacío
    const cleanData = {
      ...data,
      vehicleId: data.vehicleId || undefined,
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

        <div className="grid gap-3 md:grid-cols-2">
          <ChronoField className={fieldContainerClasses}>
            <ChronoFieldLabel htmlFor="customerSearch" className={fieldLabelClasses}>
              Buscar cliente
            </ChronoFieldLabel>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <ChronoInput
                id="customerSearch"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Buscar por nombre o documento..."
                className="pl-10"
              />
              {loadingCustomers && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}
            </div>
          </ChronoField>

          <Controller
            control={control}
            name="customerId"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="customerId" className={fieldLabelClasses}>
                  Cliente seleccionado
                </ChronoFieldLabel>

                <ChronoSelect
                  onValueChange={handleCustomerChange}
                  value={field.value ?? ""}
                  disabled={customers.length === 0}
                >
                  <ChronoSelectTrigger className="mt-1 text-left">
                    <ChronoSelectValue
                      placeholder={
                        customers.length === 0
                          ? "Busque un cliente primero"
                          : "Seleccionar cliente"
                      }
                    />
                  </ChronoSelectTrigger>
                  <ChronoSelectContent>
                    {customers.map((customer) => (
                      <ChronoSelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.documentNumber}
                      </ChronoSelectItem>
                    ))}
                  </ChronoSelectContent>
                </ChronoSelect>

                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />
        </div>
      </div>

      <ChronoSeparator />

      {/* Plan Section */}
      <div className="space-y-4">
        <ChronoSectionLabel size="sm" className="tracking-[0.2em]">
          Plan Mensual
        </ChronoSectionLabel>

        <div className="grid gap-3 md:grid-cols-2">
          <ChronoField className={fieldContainerClasses}>
            <ChronoFieldLabel htmlFor="vehicleTypeFilter" className={fieldLabelClasses}>
              Tipo de vehículo
            </ChronoFieldLabel>
            <ChronoVehicleTypeSelect
              value={selectedVehicleType}
              onValueChange={setSelectedVehicleType}
              options={vehicleTypes.map((vt) => ({ value: vt.value, label: vt.label }))}
              className="mt-1"
            />
          </ChronoField>

          <Controller
            control={control}
            name="monthlyPlanId"
            render={({ field, fieldState }) => (
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="monthlyPlanId" className={fieldLabelClasses}>
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

                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />
        </div>
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
              <ChronoField data-invalid={fieldState.invalid} className={fieldContainerClasses}>
                <ChronoFieldLabel htmlFor="vehicleId" className={fieldLabelClasses}>
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
                {fieldState.invalid && <ChronoFieldError errors={[fieldState.error]} />}
              </ChronoField>
            )}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          El vehículo es opcional. Solo se muestran vehículos activos del cliente{selectedVehicleType ? " que coinciden con el tipo de vehículo seleccionado" : ""}.
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
