"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Plus, Trash2, Package, Loader2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import ChronoButton from "@chrono/chrono-button.component";
import { ChronoBadge } from "@chrono/chrono-badge.component";
import { ChronoSectionLabel } from "@chrono/chrono-section-label.component";
import { ChronoValue } from "@chrono/chrono-value.component";
import { ChronoLabel } from "@chrono/chrono-label.component";
import { ChronoInput } from "@chrono/chrono-input.component";
import {
  ChronoSelect,
  ChronoSelectContent,
  ChronoSelectItem,
  ChronoSelectTrigger,
  ChronoSelectValue,
} from "@chrono/chrono-select.component";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { usePaymentContext } from "@/src/shared/context/payment.context";
import { useCommonContext } from "@/src/shared/context/common.context";
import { ISessionServiceEntity } from "@/server/domain";
import { addSessionServiceAction } from "../actions/add-session-service.action";
import { listSessionServicesAction } from "../actions/list-session-services.action";
import { removeSessionServiceAction } from "../actions/remove-session-service.action";
import { toast } from "sonner";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

type ServicesCartDrawerProps = {
  className?: string;
};

export function ServicesCartDrawerComponent({ className }: ServicesCartDrawerProps) {
  const { validateRaw, validateFee } = usePaymentContext();
  const { additionalServices } = useCommonContext();
  
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<ISessionServiceEntity[]>([]);
  const [servicesTotal, setServicesTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  
  // Form state for adding new service
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  const sessionId = validateRaw?.data?.parkingSessionId;
  const hasSession = Boolean(sessionId);

  const loadServices = useCallback(async () => {
    if (!sessionId) return;
    
    setIsLoading(true);
    try {
      const res = await listSessionServicesAction(sessionId);
      if (res.success && res.data) {
        setServices(res.data.services ?? []);
        setServicesTotal(res.data.total ?? 0);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  // Load services when drawer opens or session changes
  useEffect(() => {
    if (isOpen && sessionId) {
      loadServices();
    }
  }, [isOpen, sessionId, loadServices]);

  // Reset form when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedServiceId("");
      setQuantity("1");
      setNotes("");
    }
  }, [isOpen]);

  const handleAddService = async () => {
    if (!sessionId || !selectedServiceId) return;

    const selectedService = additionalServices.find(s => s.value === selectedServiceId);
    if (!selectedService) return;

    setIsAdding(true);
    const toastId = toast.loading("Agregando servicio...");
    
    try {
      const res = await addSessionServiceAction(sessionId, {
        additionalServiceId: selectedServiceId,
        quantity: parseInt(quantity) || 1,
        unitPrice: selectedService.price,
        notes: notes.trim() || undefined,
      });

      if (!res.success) {
        toast.error(res.error || "Error al agregar el servicio", { id: toastId });
        return;
      }

      toast.success("Servicio agregado", { id: toastId });
      
      // Reset form
      setSelectedServiceId("");
      setQuantity("1");
      setNotes("");
      
      // Reload services list
      await loadServices();
      
      // Revalidate session to update totals
      if (validateRaw?.data?.vehicle?.licensePlate) {
        await validateFee({
          licensePlate: validateRaw.data.vehicle.licensePlate,
          parkingSessionId: sessionId,
          exitTime: new Date(),
        });
      }
    } catch (error) {
      toast.error("Error al agregar el servicio", { id: toastId });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    if (!sessionId) return;

    setRemovingId(serviceId);
    const toastId = toast.loading("Eliminando servicio...");
    
    try {
      const res = await removeSessionServiceAction(sessionId, serviceId);

      if (!res.success) {
        toast.error(res.error || "Error al eliminar el servicio", { id: toastId });
        return;
      }

      toast.success("Servicio eliminado", { id: toastId });
      
      // Reload services list
      await loadServices();
      
      // Revalidate session to update totals
      if (validateRaw?.data?.vehicle?.licensePlate) {
        await validateFee({
          licensePlate: validateRaw.data.vehicle.licensePlate,
          parkingSessionId: sessionId,
          exitTime: new Date(),
        });
      }
    } catch (error) {
      console.error("Error removing service:", error);
      toast.error("Error al eliminar el servicio", { id: toastId });
    } finally {
      setRemovingId(null);
    }
  };

  const selectedServicePrice = additionalServices.find(s => s.value === selectedServiceId)?.price ?? 0;
  const estimatedTotal = selectedServicePrice * (parseInt(quantity) || 1);

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ChronoButton
          variant="outline"
          size="default"
          className={cn("relative gap-2", className)}
          disabled={!hasSession}
          title={hasSession ? "Servicios adicionales" : "Valida una sesión primero"}
        >
          <ShoppingCart className="h-4 w-4" />
          Servicios adicionales
          {services.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {services.length}
            </span>
          )}
        </ChronoButton>
      </DrawerTrigger>

      <DrawerContent className="sm:max-w-md">
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DrawerTitle>Servicios adicionales</DrawerTitle>
              <DrawerDescription>
                Agrega servicios extra a la sesión de parqueo
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
          {/* Add service form */}
          <div className="space-y-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-3">
            <ChronoSectionLabel size="sm" className="flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Agregar servicio
            </ChronoSectionLabel>

            <div className="space-y-2">
              <div className="space-y-1">
                <ChronoLabel className="text-xs">Servicio</ChronoLabel>
                <ChronoSelect
                  value={selectedServiceId}
                  onValueChange={setSelectedServiceId}
                  disabled={isAdding}
                >
                  <ChronoSelectTrigger className="h-9">
                    <ChronoSelectValue placeholder="Seleccionar servicio..." />
                  </ChronoSelectTrigger>
                  <ChronoSelectContent>
                    {additionalServices.map((service) => (
                      <ChronoSelectItem key={service.value} value={service.value}>
                        <div className="flex items-center justify-between gap-2">
                          <span>{service.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatCurrency(service.price)}
                          </span>
                        </div>
                      </ChronoSelectItem>
                    ))}
                  </ChronoSelectContent>
                </ChronoSelect>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <ChronoLabel className="text-xs">Cantidad</ChronoLabel>
                  <ChronoInput
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={isAdding}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <ChronoLabel className="text-xs">Total estimado</ChronoLabel>
                  <div className="flex h-9 items-center rounded-md border bg-muted/50 px-3 text-sm font-medium">
                    {formatCurrency(estimatedTotal)}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <ChronoLabel className="text-xs">Notas (opcional)</ChronoLabel>
                <ChronoInput
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones..."
                  disabled={isAdding}
                  className="h-9"
                />
              </div>

              <ChronoButton
                onClick={handleAddService}
                disabled={!selectedServiceId || isAdding}
                className="w-full"
                size="sm"
              >
                {isAdding ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Agregar al carrito
              </ChronoButton>
            </div>
          </div>

          {/* Services list */}
          <div className="flex-1 space-y-2">
            <ChronoSectionLabel size="sm" className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5" />
              Servicios agregados ({services.length})
            </ChronoSectionLabel>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : services.length === 0 ? (
              <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                No hay servicios agregados
              </div>
            ) : (
              <div className="space-y-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between gap-2 rounded-lg border bg-card p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {service.serviceName}
                        </span>
                        <ChronoBadge variant="outline" className="text-[10px]">
                          x{service.quantity}
                        </ChronoBadge>
                      </div>
                      {service.notes && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {service.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ChronoValue size="sm" weight="semibold">
                        {formatCurrency(service.totalAmount)}
                      </ChronoValue>
                      <ChronoButton
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveService(service.id)}
                        disabled={removingId === service.id}
                      >
                        {removingId === service.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </ChronoButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total servicios:</span>
            <ChronoValue size="md" weight="bold" className="text-primary">
              {formatCurrency(servicesTotal)}
            </ChronoValue>
          </div>
          <DrawerClose asChild>
            <ChronoButton variant="outline" className="w-full">
              Cerrar
            </ChronoButton>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
