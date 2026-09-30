import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Staff email address is required." },
        { status: 400 }
      );
    }

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.json(
        { error: "Authentication service unavailable. Production database connection required." },
        { status: 503 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Trigger Supabase Auth password recovery API
    const authRes = await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        email: normalizedEmail,
        options: {
          redirectTo: "https://admin.farmreem.com/reset-password",
        },
      }),
    });

    if (!authRes.ok) {
      const errorData = await authRes.json();
      return NextResponse.json(
        { error: errorData.msg || errorData.error_description || "Unable to send reset email." },
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
