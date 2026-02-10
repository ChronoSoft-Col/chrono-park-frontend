import { z } from "zod";

/**
 * Schema para crear una nueva suscripción mensual.
 * La nueva API requiere:
 * - customerId: ID del cliente existente
 * - monthlyPlanId: ID del plan mensual
 * - vehicleId: ID del vehículo (opcional)
 */
export const CreateSubscriptionSchema = z.object({
  customerId: z.string().min(1, "El cliente es requerido"),
  monthlyPlanId: z.string().min(1, "El plan mensual es requerido"),
  vehicleId: z.string().optional(),
});

export type CreateSubscriptionForm = z.infer<typeof CreateSubscriptionSchema>;

/**
 * Schema para pagar una suscripción pendiente.
 * El paymentPointId se obtiene de la sesión del usuario activa.
 */
export const PaySubscriptionSchema = z.object({
  paymentMethodId: z.string().min(1, "El método de pago es requerido"),
  monthsCount: z.number().min(1, "Debe pagar al menos 1 mes").max(12, "Máximo 12 meses").default(1),
});

export type PaySubscriptionForm = z.infer<typeof PaySubscriptionSchema>;
