import { z } from "zod";

export const CreateMasterKeySchema = z.object({
  key: z.string().min(1, "El código de la llave es requerido"),
});

export type CreateMasterKeyForm = z.infer<typeof CreateMasterKeySchema>;

export const UpdateMasterKeySchema = z.object({
  key: z.string().optional(),
});

export type UpdateMasterKeyForm = z.infer<typeof UpdateMasterKeySchema>;
