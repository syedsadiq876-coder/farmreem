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

    const redirectTo = "https://admin.farmreem.com/set-password";

    // 1. Attempt /auth/v1/recover first
    const recoverRes = await fetch(`${supabaseUrl}/auth/v1/recover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        email,
        options: {
          redirectTo,
        },
      }),
    });

    const recoverBodyText = await recoverRes.text();
    let recoverData: any = {};
    try {
      recoverData = JSON.parse(recoverBodyText);
    } catch (e) {
      recoverData = { raw: recoverBodyText };
    }

    console.log(`[Supabase Auth /recover] Status: ${recoverRes.status}`, recoverData);

    // If recover failed with explicit HTTP error (e.g. 429 rate limit or 400 validation)
    if (!recoverRes.ok) {
      const errorMsg = recoverData.msg || recoverData.error_description || recoverData.message || "Supabase Auth rejected recovery request.";
      return NextResponse.json(
        {
          success: false,
          supabaseStatus: recoverRes.status,
          error: errorMsg,
          details: recoverData,
        },
        { status: recoverRes.status }
      );
    }

    // 2. Also test /auth/v1/resend (type: signup/invite) if user needs re-confirmation
    const resendRes = await fetch(`${supabaseUrl}/auth/v1/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        type: "signup",
        email,
        options: {
          redirectTo,
        },
      }),
    });

    const resendBodyText = await resendRes.text();
    let resendData: any = {};
    try {
      resendData = JSON.parse(resendBodyText);
    } catch (e) {
      resendData = { raw: resendBodyText };
    }

    console.log(`[Supabase Auth /resend] Status: ${resendRes.status}`, resendData);

    return NextResponse.json({
      success: true,
      email,
      supabaseStatus: recoverRes.status,
      redirectTo,
      recoverResponse: recoverData,
      resendResponse: resendData,
      message: `Account activation email dispatched to ${email}`,
    });
  } catch (error: any) {
    console.error("[send-activation] Exception:", error);
    return NextResponse.json(
      { error: error?.message || "Authentication service unavailable." },
      { status: 500 }
    );
  }
}
