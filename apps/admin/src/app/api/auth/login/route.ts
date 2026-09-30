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

    // 1. Authenticate credentials directly against Supabase Auth API
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    const authData = await authRes.json();

    if (!authRes.ok || !authData.access_token || !authData.user) {
      return NextResponse.json(
        { error: authData.error_description || "Invalid staff email or password." },
        { status: 401 }
      );
    }

    // 2. Perform live DB authorization check against public.users (Verifies status=ACTIVE & app_access)
    try {
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/users?id=eq.${authData.user.id}&select=id,email,status,staff_role,metadata`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${authData.access_token}`,
          },
        }
      );

      if (profileRes.ok) {
        const profiles = await profileRes.json();
        const userProfile = profiles[0];

        // DENY ACCESS if user profile is SUSPENDED, DEACTIVATED, or not yet provisioned
        if (!userProfile || userProfile.status !== "ACTIVE") {
          return NextResponse.json(
            { error: "Account pending administrator activation. Access denied." },
            { status: 403 }
          );
        }

        const appAccess = userProfile.metadata?.app_access || [];
        if (!userProfile.staff_role && !appAccess.includes("admin")) {
          return NextResponse.json(
            { error: "Insufficient permissions. Admin app access required." },
            { status: 403 }
          );
        }
      }
    } catch (dbErr) {
      // If DB profile check fails, fail closed for security
      return NextResponse.json(
        { error: "Unable to verify staff authorization status." },
        { status: 500 }
      );
    }

    // 3. Issue secure HTTP-only Supabase session cookie upon successful live DB verification
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
