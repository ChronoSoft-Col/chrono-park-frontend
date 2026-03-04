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
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  vehicleTypeRestricted: z.boolean().default(false),
});

export type CreateSubscriptionForm = z.infer<typeof CreateSubscriptionSchema>;

/**
 * Schema para pagar una suscripción pendiente.
 * El paymentPointId se obtiene de la sesión del usuario activa.
 */
export const PaySubscriptionSchema = z.object({
  paymentMethodId: z.string().min(1, "El método de pago es requerido"),
  monthsCount: z
    .number()
    .min(1, "Debe pagar al menos 1 mes")
    .max(12, "Máximo 12 meses")
    .default(1),
  discountType: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(["PERCENTAGE", "FIXED_AMOUNT"]).optional()
  ),
  discountValue: z
    .number({ invalid_type_error: "El valor del descuento debe ser un número" })
    .min(0, "No se aceptan valores negativos")
    .optional(),
}).superRefine((data, ctx) => {
  if (data.discountType && data.discountValue === undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El valor del descuento es requerido",
      path: ["discountValue"],
    });
  }

  if (data.discountType === "PERCENTAGE" && data.discountValue !== undefined && data.discountValue > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "El porcentaje de descuento no puede ser mayor a 100%",
      path: ["discountValue"],
    });
  }
});

export type PaySubscriptionForm = z.infer<typeof PaySubscriptionSchema>;
