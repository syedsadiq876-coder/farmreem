import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || "ceo@farmreem.com").trim().toLowerCase();

    // Endpoint Security Hardening: Restrict bootstrap activation endpoint to ceo@farmreem.com
    if (email !== "ceo@farmreem.com") {
      return NextResponse.json(
        { error: "Unauthorized email target. Activation endpoint is restricted during bootstrap phase." },
        { status: 403 }
      );
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.json(
        { error: "Authentication service unavailable. Production database connection required." },
        { status: 503 }
      );
    }

    const serviceKey = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    // FAIL CLOSED REQUIREMENT: Both SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY are strictly required.
    // Zero fallbacks to direct Supabase mailer allowed for Flow A activation emails.
    if (!serviceKey || !resendApiKey) {
      const missingKeys = [];
      if (!serviceKey) missingKeys.push("SUPABASE_SERVICE_ROLE_KEY");
      if (!resendApiKey) missingKeys.push("RESEND_API_KEY");

      return NextResponse.json(
        {
          error: `Activation service unconfigured. Required environment variable(s) missing: ${missingKeys.join(", ")}. Direct mailer fallback is disabled for security.`,
        },
        { status: 503 }
      );
    }

    const setPasswordRedirect = "https://admin.farmreem.com/set-password";

    // 1. Generate single-use magiclink action_link via Supabase Admin Auth API
    const generateRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        type: "magiclink",
        email: email,
        options: {
          redirectTo: setPasswordRedirect,
        },
      }),
    });

    const generateData = await generateRes.json();

    if (!generateRes.ok || !generateData.action_link) {
      console.error("[send-activation] Admin generate_link status:", generateRes.status);
      return NextResponse.json(
        { error: "Failed to generate single-use activation link from Supabase Auth." },
        { status: generateRes.status || 500 }
      );
    }

    const actionLink = generateData.action_link;

    // 2. Wrap actionLink in scanner-safe intermediate /activate URL to prevent mail scanner token pre-consumption
    const activationTargetUrl = `https://admin.farmreem.com/activate?target=${encodeURIComponent(actionLink)}`;

    // 3. Dispatch custom branded email strictly via Resend API
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "FarmReem <noreply@farmreem.com>",
        to: [email],
        subject: "Activate your FarmReem Admin Account",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF7F2; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 36px; border-radius: 24px; border: 1px solid #E8E1D3; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #0F2E23; font-size: 24px; font-weight: 800; margin: 0;">Welcome to FarmReem Admin</h1>
                <p style="color: #C59B27; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px;">Internal Operations Portal</p>
              </div>
              <p style="color: #4F5E57; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
                Your FarmReem staff account has been created. Use the secure link below to create your password and activate your account.
              </p>
              <div style="margin: 32px 0; text-align: center;">
                <a href="${activationTargetUrl}" style="background-color: #0F2E23; color: #ffffff; padding: 14px 28px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(15,46,35,0.2);">
                  Create Password & Activate Account
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #E8E1D3; margin: 28px 0;" />
              <p style="color: #8C9A94; font-size: 11px; line-height: 1.5; margin: 0; text-align: center;">
                This link is single-use and expires automatically. If you did not request account activation, please contact your FarmReem administrator.
              </p>
            </div>
          </div>
        `,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("[send-activation] Resend API status:", resendRes.status);
      return NextResponse.json(
        { error: resendData.message || "Resend email dispatch failed." },
        { status: resendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      email,
      linkTypeUsed: "scanner_safe_resend_magiclink",
      intermediateRoute: "https://admin.farmreem.com/activate",
      redirectTo: setPasswordRedirect,
      message: `Scanner-safe activation email dispatched to ${email} via Resend`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Authentication service unavailable." },
      { status: 500 }
    );
  }
}
