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
        { error: "Missing invitation session token. Please open the invitation link from your email." },
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

    // Call Supabase Auth user update API to update password for newly invited staff member
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
      const errorMsg = authData.msg || authData.error_description || "Unable to set password.";
      if (authRes.status === 401 || authRes.status === 403 || authData.error_code === "otp_expired") {
        return NextResponse.json(
          { error: "This invitation link has expired or has already been used. Please contact your FarmReem administrator for a new invitation." },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: errorMsg },
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
