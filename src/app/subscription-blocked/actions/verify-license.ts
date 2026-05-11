"use server";

import { getServerApi } from "@/lib/axios-server";
import { SKIP_LICENSE_REDIRECT_HEADER } from "@/lib/license-redirect";

type VerifyLicenseResult = { ok: boolean };

export async function verifyLicense(): Promise<VerifyLicenseResult> {
  try {
    const api = getServerApi();
    await api.get("/health", {
      headers: { [SKIP_LICENSE_REDIRECT_HEADER]: "1" },
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
