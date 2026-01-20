import z from "zod";

const normalizePlate = (value: unknown) => {
  if (typeof value !== "string") return value;
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
};

const isValidColombianPlate = (plate: string) => {
  if (!plate) return false;
  // Car: ABC123
  // Motorcycle: ABC12D
  return /^[A-Z]{3}\d{3}$/.test(plate) || /^[A-Z]{3}\d{2}[A-Z]$/.test(plate);
};

export const ValidateFeeSchema = z.object({
  parkingSessionId: z
    .string()
    .trim()
    .refine((v) => v === "" || z.string().uuid().safeParse(v).success, {
      message: "Código QR inválido",
    }),
  licensePlate: z
    .preprocess(normalizePlate, z.string())
    .refine((v) => v === "" || isValidColombianPlate(v), {
      message: "Placa inválida (CO)",
    }),
  exitTime: z.coerce.date({
    error: "La fecha y hora de salida son inválidas",
  }),
}).superRefine((data, ctx) => {
  const hasQr = Boolean(data.parkingSessionId);
  const hasPlate = Boolean(data.licensePlate);

  if (!hasQr && !hasPlate) {
    ctx.addIssue({
      code: "custom",
      message: "Debes ingresar QR o placa",
      path: ["parkingSessionId"],
    });
    ctx.addIssue({
      code: "custom",
      message: "Debes ingresar QR o placa",
      path: ["licensePlate"],
    });
    return;
  }

  if (hasQr && hasPlate) {
    ctx.addIssue({
      code: "custom",
      message: "Usa solo QR o solo placa (no ambos)",
      path: ["parkingSessionId"],
    });
    ctx.addIssue({
      code: "custom",
      message: "Usa solo QR o solo placa (no ambos)",
      path: ["licensePlate"],
    });
  }
});

export type ValidateFeeForm = z.infer<typeof ValidateFeeSchema>;