import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    redirectUrl: "/login",
  });

  // Destroy session cookie
  response.cookies.set("__Host-farmreem-admin-session", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}
