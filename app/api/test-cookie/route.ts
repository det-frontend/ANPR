import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  cookieStore.set("test-cookie", "hello", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60,
    path: "/",
  });
  return NextResponse.json({ ok: true });
}
