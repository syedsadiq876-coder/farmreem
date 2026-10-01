import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(request: Request) {
  try {
    const { password, accessToken, tokenHash, code, type = "recovery" } = await request.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (!accessToken && !tokenHash && !code) {
      return NextResponse.json(
        { error: "This invitation link has expired or has already been used. Please contact your FarmReem administrator for a new invitation." },
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

    let activeAccessToken = accessToken;

    // 1. If tokenHash is provided, exchange token_hash for session via Supabase Auth /verify API
    if (!activeAccessToken && tokenHash) {
      const verifyRes = await fetch(`${supabaseUrl}/auth/v1/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          type: type || "recovery",
          token_hash: tokenHash,
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        return NextResponse.json(
          { error: "This invitation link has expired or has already been used. Please contact your FarmReem administrator for a new invitation." },
          { status: 401 }
        );
      }

      activeAccessToken = verifyData.access_token;
    }

    // 2. If PKCE code is provided, exchange auth_code for session via Supabase Auth /token API
    if (!activeAccessToken && code) {
      const tokenRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          auth_code: code,
        }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        return NextResponse.json(
          { error: "This invitation link has expired or has already been used. Please contact your FarmReem administrator for a new invitation." },
          { status: 401 }
        );
      }

      activeAccessToken = tokenData.access_token;
    }

    if (!activeAccessToken) {
      return NextResponse.json(
        { error: "This invitation link has expired or has already been used. Please contact your FarmReem administrator for a new invitation." },
        { status: 401 }
      );
    }

    // 3. Update password in Supabase Auth using the validated access token
    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${activeAccessToken}`,
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
