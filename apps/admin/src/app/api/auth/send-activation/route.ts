import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || "ceo@farmreem.com").trim().toLowerCase();

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.json(
        { error: "Authentication service unavailable. Production database connection required." },
        { status: 503 }
      );
    }

    // Trigger Supabase Auth activation email with redirectTo set to /set-password
    const authRes = await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        email,
        options: {
          redirectTo: "https://admin.farmreem.com/set-password",
        },
      }),
    });

    const authData = await authRes.json();

    if (!authRes.ok) {
      return NextResponse.json(
        { error: authData.msg || authData.error_description || "Unable to send activation email." },
        { status: authRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Account activation email sent to ${email}`,
      redirectTo: "https://admin.farmreem.com/set-password",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication service unavailable." },
      { status: 500 }
    );
  }
}
