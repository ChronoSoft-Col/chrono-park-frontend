import { NextResponse } from "next/server";

import { destroySession } from "@/src/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nextParam = searchParams.get("next");
  const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : "/auth/login?reason=expired";

  await destroySession();

  return NextResponse.redirect(new URL(safeNext, request.url));
}
