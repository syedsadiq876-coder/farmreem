import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(request: Request) {
  try {
    const { password, accessToken } = await request.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing recovery session token. Please use the password reset link from your email." },
        { status: 401 }
      );
    }

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.json(
        { error: "Authentication service unavailable. Production database connection required." },
        { status: 503 }
      );
    }

    // Call Supabase Auth user update API to update password for authenticated recovery token
    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      return NextResponse.json(
        { error: authData.msg || authData.error_description || "Unable to update password." },
        { status: authRes.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication service unavailable." },
      { status: 500 }
    );
  }
}
