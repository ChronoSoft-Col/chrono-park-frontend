import { z } from "zod";

export const CreateBlackListSchema = z.object({
  vehicleId: z.string().min(1, "El vehículo es requerido"),
  customerId: z.string().optional(),
  reason: z.string().min(1, "La razón es requerida"),
});

export type CreateBlackListForm = z.infer<typeof CreateBlackListSchema>;

export const UpdateBlackListSchema = z.object({
  reason: z.string().optional(),
  vehicleId: z.string().optional(),
  customerId: z.string().optional(),
});

export type UpdateBlackListForm = z.infer<typeof UpdateBlackListSchema>;
