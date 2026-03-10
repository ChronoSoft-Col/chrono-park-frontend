import { z } from "zod";

export const CreateWhiteListSchema = z.object({
  vehicleId: z.string().optional(),
  customerId: z.string().optional(),
  reason: z.string().min(1, "La razón es requerida"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
});

export type CreateWhiteListForm = z.infer<typeof CreateWhiteListSchema>;

export const UpdateWhiteListSchema = z.object({
  reason: z.string().optional(),
  vehicleId: z.string().optional(),
  customerId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type UpdateWhiteListForm = z.infer<typeof UpdateWhiteListSchema>;
