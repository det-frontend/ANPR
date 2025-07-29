import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  //   cookieStore.set("test-cookie", "hello", {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: "lax",
  //     maxAge: 60 * 60,
  //     path: "/",
  //   });
  cookieStore.set("auth-token", "test", {
    httpOnly: true,
    // Only secure in production, not on localhost
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/", // Ensure cookie is sent on all routes
  });
  return NextResponse.json({ ok: true });
}
