import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    // FAIL CLOSED if Supabase is not properly configured
    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.json(
        { error: "Authentication service unavailable. Production database connection required." },
        { status: 503 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Authenticate directly against Supabase Auth API
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok || !authData.access_token) {
      return NextResponse.json(
        { error: authData.error_description || "Invalid staff email or password." },
        { status: 401 }
      );
    }

    // Set secure HTTP-only Supabase session cookie
    const response = NextResponse.json({
      success: true,
      redirectUrl: "/dashboard",
    });

    response.cookies.set("__Host-farmreem-admin-session", authData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: authData.expires_in || 60 * 60 * 24, // Session duration
    });

    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication service unavailable." },
      { status: 500 }
    );
  }
}
