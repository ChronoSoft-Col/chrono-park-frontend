import z from "zod";

const normalizePlate = (value: string) => {
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
    .string()
    .transform(normalizePlate)
    .refine((v) => v === "" || isValidColombianPlate(v), {
      message: "Placa inválida (CO)",
    }),
  // ChronoDateTimePicker provides a Date; avoid coercion to keep types aligned.
  exitTime: z.date({
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

  // NOTE: We allow both QR + plate because in some cases the backend returns an
  // empty vehicle in the first validate and requires a second validate with both.
});

export type ValidateFeeForm = z.infer<typeof ValidateFeeSchema>;