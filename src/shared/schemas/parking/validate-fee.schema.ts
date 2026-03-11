import z from "zod";

import { isValidColombianPlate, normalizePlate } from "@/src/lib/utils/plate.utils";

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