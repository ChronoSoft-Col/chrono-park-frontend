import { NextResponse, type NextRequest } from "next/server";

import { getSessionFromRequest } from "@/src/lib/session";

export const ADMIN_PREFIX = "/parking";

export const PROTECTED_MATCHERS = [ADMIN_PREFIX, `${ADMIN_PREFIX}/:path*`];
export const LOGIN_ROUTE = "/auth/login";

export function shouldProtect(pathname: string): boolean {
  if (!pathname.startsWith("/")) {
    return false;
  }

  if (pathname === ADMIN_PREFIX) {
    return true;
  }

  return pathname.startsWith(`${ADMIN_PREFIX}/`);
}

/**
 * Obtiene la URL base real del request, considerando proxies y hosts alternativos
 */
function getBaseUrl(request: NextRequest): string {
  // Intentar obtener el host del header (funciona cuando hay proxy o acceso por IP/dominio)
  const host = request.headers.get("host") || request.headers.get("x-forwarded-host");
  const protocol = request.headers.get("x-forwarded-proto") || 
    (request.url.startsWith("https") ? "https" : "http");
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  // Fallback: usar la URL del request
  return `${request.nextUrl.protocol}//${request.nextUrl.host}`;
}

export async function proxy(request: NextRequest): Promise<NextResponse | null> {
  const { pathname } = request.nextUrl;

  if (!shouldProtect(pathname)) {
    return null;
  }

  const session = await getSessionFromRequest(request);

  if (session) {
    return null;
  }

  const baseUrl = getBaseUrl(request);
  const loginUrl = new URL(LOGIN_ROUTE, baseUrl);
  loginUrl.searchParams.set("from", pathname);

  return NextResponse.redirect(loginUrl);
}

export const proxyConfig = {
  matcher: PROTECTED_MATCHERS,
};
