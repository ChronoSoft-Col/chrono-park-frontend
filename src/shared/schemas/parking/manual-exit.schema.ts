import { z } from "zod";

export const ManualExitSchema = z.object({
  identifier: z
    .string()
    .min(1, "El identificador es obligatorio")
    .max(50, "El identificador es demasiado largo"),
  exitTime: z.coerce.date().optional(),
});

export type ManualExitForm = z.infer<typeof ManualExitSchema>;
