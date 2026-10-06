import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";
import crypto from "crypto";

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

    // 1. Generate a cryptographically random opaque activation token (64 hex characters)
    const rawOpaqueToken = crypto.randomBytes(32).toString("hex");

    // 2. Compute SHA-256 hash for secure server-side storage
    const tokenHash = crypto.createHash("sha256").update(rawOpaqueToken).digest("hex");

    // 15-minute token lifespan
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 3. Persist activation request in database (Status: PENDING)
    const dbRes = await fetch(`${supabaseUrl}/rest/v1/activation_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        token_hash: tokenHash,
        email: email,
        purpose: "FIRST_PASSWORD_SETUP",
        status: "PENDING",
        expires_at: expiresAt,
      }),
    });

    if (!dbRes.ok) {
      const dbData = await dbRes.json().catch(() => ({}));
      console.error("[send-activation] Database insert error status:", dbRes.status, dbData);
      return NextResponse.json(
        { error: dbData.message || dbData.details || "Failed to initialize server-side activation request record." },
        { status: 500 }
      );
    }

    // 4. Construct tokenless activation URL (Contains ONLY FarmReem domain + opaque ID)
    // ABSOLUTELY NO Supabase action link, token, token_hash, or redirect_to is in the email!
    const tokenlessActivationUrl = `https://admin.farmreem.com/activate?id=${rawOpaqueToken}`;

    // 5. Dispatch custom branded email strictly via Resend API
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
                <a href="${tokenlessActivationUrl}" style="background-color: #0F2E23; color: #ffffff; padding: 14px 28px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(15,46,35,0.2);">
                  Create Password & Activate Account
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #E8E1D3; margin: 28px 0;" />
              <p style="color: #8C9A94; font-size: 11px; line-height: 1.5; margin: 0; text-align: center;">
                This link is single-use and expires automatically in 15 minutes. If you did not request account activation, please contact your FarmReem administrator.
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
      linkTypeUsed: "tokenless_opaque_nonce",
      intermediateRoute: "https://admin.farmreem.com/activate",
      message: `Tokenless activation email dispatched to ${email} via Resend`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Authentication service unavailable." },
      { status: 500 }
    );
  }
}
