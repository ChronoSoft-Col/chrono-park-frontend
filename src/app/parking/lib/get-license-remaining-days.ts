import "server-only";

import { getServerApi } from "@/lib/axios-server";
import { SKIP_LICENSE_REDIRECT_HEADER } from "@/lib/license-redirect";

type LicenseStatusEnvelope = {
  data?: {
    valid?: boolean;
    remainingDays?: number | null;
  };
};

export async function getLicenseRemainingDays(): Promise<number | null> {
  try {
    const api = getServerApi();
    const res = await api.get<LicenseStatusEnvelope>("/license/status", {
      headers: { [SKIP_LICENSE_REDIRECT_HEADER]: "1" },
    });
    const status = res.data?.data;
    if (!status?.valid) return null;
    return typeof status.remainingDays === "number" ? status.remainingDays : null;
  } catch {
    return null;
  }
}
