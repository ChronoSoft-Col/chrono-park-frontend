import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { destroySession } from "@/src/lib/session";

/**
 * Obtiene la URL base real del request, considerando proxies y hosts alternativos
 */
async function getBaseUrl(request: Request): Promise<string> {
  const headersList = await headers();
  
  // Intentar obtener el host del header (funciona cuando hay proxy o acceso por IP/dominio)
  const host = headersList.get("host") || headersList.get("x-forwarded-host");
  const protocol = headersList.get("x-forwarded-proto") || 
    (request.url.startsWith("https") ? "https" : "http");
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  // Fallback: usar la URL del request
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nextParam = searchParams.get("next");
  const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/auth/login?reason=expired";

  await destroySession();

  const baseUrl = await getBaseUrl(request);
  return NextResponse.redirect(new URL(safeNext, baseUrl));
}
