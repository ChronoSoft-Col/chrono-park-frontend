import { z } from "zod";

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

export const UpdateCustomerSchema = z.object({
  firstName: z.preprocess(normalizeText, z.string().min(1, "Ingresa el nombre")),
  lastName: z.preprocess(normalizeText, z.string().min(1, "Ingresa el apellido")),
  email: z
    .preprocess(normalizeText, z.string().email("Email inválido"))
    .optional()
    .or(z.literal("")),
  phoneNumber: z.preprocess(normalizeText, z.string().optional()).optional(),
  agreementId: z.preprocess(normalizeText, z.string().optional()).optional(),
});

export type UpdateCustomerForm = z.infer<typeof UpdateCustomerSchema>;
