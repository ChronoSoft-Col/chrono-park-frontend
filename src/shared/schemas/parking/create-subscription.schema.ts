import { z } from "zod";

export const CreateSubscriptionSchema = z.object({
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().min(1, "La fecha de vencimiento es requerida"),
  rateProfileId: z.string().min(1, "El perfil de tarifa es requerido"),
  customer: z.object({
    id: z.string().optional(),
    documentTypeId: z.string().min(1, "El tipo de documento es requerido"),
    documentNumber: z.string().min(1, "El número de documento es requerido"),
    firstName: z.string().min(1, "El nombre es requerido"),
    lastName: z.string().min(1, "El apellido es requerido"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phoneNumber: z.string().optional(),
  }),
  vehicle: z
    .object({
      id: z.string().optional(),
      licensePlate: z.string().min(1, "La placa es requerida"),
      vehicleTypeId: z.string().min(1, "El tipo de vehículo es requerido"),
    })
    .optional(),
});

export type CreateSubscriptionForm = z.infer<typeof CreateSubscriptionSchema>;
