import { z } from "zod";

const normalizeText = (value: unknown) =>
  typeof value === "string" ? value.trim() : value;

const normalizeUpper = (value: unknown) =>
  typeof value === "string" ? value.trim().toUpperCase() : value;

export const CreateCustomerSchema = z.object({
  documentTypeId: z.preprocess(normalizeText, z.string().min(1, "Selecciona el tipo de documento")),
  documentNumber: z.preprocess(normalizeText, z.string().min(1, "Ingresa el número de documento")),
  firstName: z.preprocess(normalizeText, z.string().min(1, "Ingresa el nombre")),
  lastName: z.preprocess(normalizeText, z.string().min(1, "Ingresa el apellido")),
  email: z
    .preprocess(normalizeText, z.string().email("Email inválido"))
    .optional()
    .or(z.literal("")),
  phoneNumber: z.preprocess(normalizeText, z.string().optional()).optional(),
  agreementId: z.preprocess(normalizeText, z.string().optional()).optional(),
  vehicles: z
    .array(
      z.object({
        licensePlate: z.preprocess(
          normalizeUpper,
          z
            .string()
            .min(1, "Ingresa la placa")
            .max(12, "Placa demasiado larga"),
        ),
        vehicleTypeId: z.preprocess(normalizeText, z.string().min(1, "Selecciona el tipo de vehículo")),
      }),
    )
    .min(1, "Agrega al menos un vehículo"),
});

export type CreateCustomerForm = z.infer<typeof CreateCustomerSchema>;
