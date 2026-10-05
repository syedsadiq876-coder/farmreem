import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    let rawOpaqueToken = "";

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json().catch(() => ({}));
      rawOpaqueToken = (body.id || body.token || "").trim();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await request.formData().catch(() => new FormData());
      rawOpaqueToken = (formData.get("id") || formData.get("token") || "").toString().trim();
    } else {
      const body = await request.json().catch(() => ({}));
      rawOpaqueToken = (body.id || body.token || "").trim();
    }

    if (!rawOpaqueToken) {
      return NextResponse.redirect(new URL("/activate?error=missing_id", request.url), 303);
    }

    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.redirect(new URL("/activate?error=auth_service_unavailable", request.url), 303);
    }

    const serviceKey = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!serviceKey) {
      return NextResponse.redirect(new URL("/activate?error=service_unconfigured", request.url), 303);
    }

    // Compute SHA-256 hash of submitted opaque token
    const tokenHash = crypto.createHash("sha256").update(rawOpaqueToken).digest("hex");
    const nowIso = new Date().toISOString();

    // STEP A: Atomic Claim Sequence (Transition status PENDING -> CLAIMED for ceo@farmreem.com)
    const claimRes = await fetch(
      `${supabaseUrl}/rest/v1/activation_requests?token_hash=eq.${tokenHash}&status=eq.PENDING&email=eq.ceo%40farmreem.com&expires_at=gt.${encodeURIComponent(nowIso)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          status: "CLAIMED",
          claimed_at: nowIso,
        }),
      }
    );

    const claimedRecords = await claimRes.json().catch(() => []);

    if (!claimRes.ok || !Array.isArray(claimedRecords) || claimedRecords.length === 0) {
      // Activation request is either invalid, expired, already claimed by concurrent request, or used
      return NextResponse.redirect(new URL("/activate?error=expired_or_invalid", request.url), 303);
    }

    // STEP B: On-Demand Supabase Token Generation (Executed strictly upon explicit human POST)
    const setPasswordRedirect = "https://admin.farmreem.com/set-password";
    const generateRes = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        type: "recovery",
        email: "ceo@farmreem.com",
        redirect_to: setPasswordRedirect,
        options: {
          redirectTo: setPasswordRedirect,
          redirect_to: setPasswordRedirect,
        },
      }),
    });

    const generateData = await generateRes.json().catch(() => ({}));

    // STEP C: Finalize Sequence
    if (generateRes.ok && generateData.action_link) {
      // Finalize status: CLAIMED -> USED
      await fetch(`${supabaseUrl}/rest/v1/activation_requests?token_hash=eq.${tokenHash}&status=eq.CLAIMED`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          status: "USED",
          used_at: new Date().toISOString(),
        }),
      });

      // Immediate 303 redirect to freshly generated Supabase recovery action link
      return NextResponse.redirect(generateData.action_link, 303);
    } else {
      // Supabase link generation failed: Safely rollback status CLAIMED -> PENDING so request remains usable
      await fetch(`${supabaseUrl}/rest/v1/activation_requests?token_hash=eq.${tokenHash}&status=eq.CLAIMED`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({
          status: "PENDING",
          claimed_at: null,
        }),
      });

      return NextResponse.redirect(
        new URL(`/activate?id=${encodeURIComponent(rawOpaqueToken)}&error=supabase_link_generation_failed`, request.url),
        303
      );
    }
  } catch (error: any) {
    return NextResponse.redirect(new URL("/activate?error=activation_failed", request.url), 303);
  }
}
