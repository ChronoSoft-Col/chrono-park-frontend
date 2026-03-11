import { z } from "zod";

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

export const CreateUserSchema = z.object({
  email: z.preprocess(
    normalizeText,
    z.string().min(1, "Ingresa el email").max(100).email("Email inválido"),
  ),
  documentNumber: z.preprocess(
    normalizeText,
    z.string().min(5, "Mínimo 5 caracteres").max(20, "Máximo 20 caracteres"),
  ),
  firstName: z.preprocess(
    normalizeText,
    z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  ),
  lastName: z.preprocess(
    normalizeText,
    z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
  ),
  password: z.preprocess(
    normalizeText,
    z.string().min(6, "Mínimo 6 caracteres").max(100, "Máximo 100 caracteres"),
  ),
  documentTypeId: z.preprocess(
    normalizeText,
    z.string().min(1, "Selecciona el tipo de documento"),
  ),
  roleId: z.preprocess(
    normalizeText,
    z.string().min(1, "Selecciona un rol"),
  ),
});

export type CreateUserForm = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  email: z.preprocess(
    normalizeText,
    z.string().max(100).email("Email inválido").optional(),
  ).optional(),
  documentNumber: z.preprocess(
    normalizeText,
    z.string().min(5, "Mínimo 5 caracteres").max(20).optional(),
  ).optional(),
  firstName: z.preprocess(
    normalizeText,
    z.string().min(2, "Mínimo 2 caracteres").max(100).optional(),
  ).optional(),
  lastName: z.preprocess(
    normalizeText,
    z.string().min(2, "Mínimo 2 caracteres").max(100).optional(),
  ).optional(),
  password: z.preprocess(
    normalizeText,
    z.string().min(6, "Mínimo 6 caracteres").max(100).optional().or(z.literal("")),
  ).optional(),
  documentTypeId: z.preprocess(normalizeText, z.string().optional()).optional(),
  roleId: z.preprocess(normalizeText, z.string().optional()).optional(),
});

export type UpdateUserForm = z.infer<typeof UpdateUserSchema>;
