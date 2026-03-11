import { z } from "zod";

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

export const CreateRoleSchema = z.object({
  name: z.preprocess(
    normalizeText,
    z.string().min(2, "Mínimo 2 caracteres").max(50, "Máximo 50 caracteres"),
  ),
  description: z.preprocess(
    normalizeText,
    z.string().max(255, "Máximo 255 caracteres").optional().or(z.literal("")),
  ),
});

export type CreateRoleForm = z.infer<typeof CreateRoleSchema>;

export const UpdateRoleSchema = z.object({
  name: z.preprocess(
    normalizeText,
    z.string().min(2, "Mínimo 2 caracteres").max(50).optional(),
  ).optional(),
  description: z.preprocess(
    normalizeText,
    z.string().max(255).optional().or(z.literal("")),
  ).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateRoleForm = z.infer<typeof UpdateRoleSchema>;
