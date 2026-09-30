import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body.email || "ceo@farmreem.com").trim().toLowerCase();

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.json(
        { error: "Authentication service unavailable. Production database connection required." },
        { status: 503 }
      );
    }

    const redirectTo = "https://admin.farmreem.com/set-password";
    const serviceKey = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;

    let actionLink: string | null = null;
    let linkTypeUsed = "magiclink";

    // 1. Server-side generateLink using Supabase Admin Auth API if Service Role Key is available
    if (serviceKey) {
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
            redirectTo: redirectTo,
          },
        }),
      });

      const generateData = await generateRes.json();

      if (generateRes.ok && generateData.action_link) {
        actionLink = generateData.action_link;
        linkTypeUsed = "admin_generate_magiclink";
      } else {
        console.error("[send-activation] Admin generate_link error:", generateRes.status);
      }
    }

    // 2. Dispatch custom branded email via Resend if custom mailer API key is present and action_link generated
    if (actionLink && resendApiKey) {
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
                  <a href="${actionLink}" style="background-color: #0F2E23; color: #ffffff; padding: 14px 28px; border-radius: 12px; font-weight: 800; text-decoration: none; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(15,46,35,0.2);">
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
        console.error("[send-activation] Resend API error:", resendRes.status);
        return NextResponse.json(
          { error: resendData.message || "Resend email dispatch failed." },
          { status: resendRes.status }
        );
      }

      return NextResponse.json({
        success: true,
        email,
        linkTypeUsed: "resend_custom_magiclink",
        redirectTo,
        message: `Custom activation email dispatched to ${email} via Resend`,
      });
    }

    // 3. Fallback: Call Supabase Auth magiclink endpoint directly if Resend API key is not in environment
    const magiclinkRes = await fetch(`${supabaseUrl}/auth/v1/magiclink`, {
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

    const magiclinkData = await magiclinkRes.json().catch(() => ({}));

    if (!magiclinkRes.ok) {
      const errorMsg = magiclinkData.msg || magiclinkData.error_description || magiclinkData.message || "Unable to send activation email.";
      return NextResponse.json(
        {
          success: false,
          supabaseStatus: magiclinkRes.status,
          error: errorMsg,
        },
        { status: magiclinkRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      email,
      supabaseStatus: magiclinkRes.status,
      linkTypeUsed: "supabase_magiclink",
      redirectTo,
      message: `First-time activation magiclink dispatched to ${email}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Authentication service unavailable." },
      { status: 500 }
    );
  }
}
