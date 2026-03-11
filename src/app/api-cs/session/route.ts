import { NextResponse } from "next/server";

import { destroySession, getSession } from "@/src/lib/session";

export async function GET() {
  const session = await getSession();

  return NextResponse.json(session ?? null, {
    status: 200,
  });
}

export async function DELETE() {
  await destroySession();

  return new NextResponse(null, {
    status: 204,
  });
}
