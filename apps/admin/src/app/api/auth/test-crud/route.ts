import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET() {
  try {
    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.json({ error: "Production database connection unconfigured." }, { status: 503 });
    }

    const serviceKey = supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!serviceKey) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing." }, { status: 503 });
    }

    const testTokenHash = "temp_test_crud_hash_1234567890abcdef";
    const testEmail = "temp_crud_test@farmreem.local";
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 1. INSERT test row
    const insertRes = await fetch(`${supabaseUrl}/rest/v1/activation_requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        token_hash: testTokenHash,
        email: testEmail,
        purpose: "CRUD_VERIFICATION",
        status: "PENDING",
        expires_at: expiresAt,
      }),
    });

    const insertedData = await insertRes.json().catch(() => []);
    const insertPass = insertRes.ok && Array.isArray(insertedData) && insertedData.length > 0;

    if (!insertPass) {
      return NextResponse.json({
        pass: false,
        error: "Insert test row failed",
        status: insertRes.status,
        details: insertedData,
      }, { status: 500 });
    }

    // 2. READ test row
    const readRes = await fetch(`${supabaseUrl}/rest/v1/activation_requests?token_hash=eq.${testTokenHash}`, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    const readData = await readRes.json().catch(() => []);
    const readPass = readRes.ok && Array.isArray(readData) && readData.length === 1 && readData[0].status === "PENDING";

    // 3. UPDATE test row
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/activation_requests?token_hash=eq.${testTokenHash}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "CLAIMED",
        claimed_at: new Date().toISOString(),
      }),
    });

    const updatedData = await updateRes.json().catch(() => []);
    const updatePass = updateRes.ok && Array.isArray(updatedData) && updatedData.length === 1 && updatedData[0].status === "CLAIMED";

    // 4. DELETE test row
    const deleteRes = await fetch(`${supabaseUrl}/rest/v1/activation_requests?token_hash=eq.${testTokenHash}`, {
      method: "DELETE",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
    });

    const deleteData = await deleteRes.json().catch(() => []);
    const deletePass = deleteRes.ok;

    // 5. CONFIRM CLEANUP
    const cleanupRes = await fetch(`${supabaseUrl}/rest/v1/activation_requests?token_hash=eq.${testTokenHash}`, {
      method: "GET",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    });

    const cleanupData = await cleanupRes.json().catch(() => []);
    const cleanupPass = cleanupRes.ok && Array.isArray(cleanupData) && cleanupData.length === 0;

    const allPassed = insertPass && readPass && updatePass && deletePass && cleanupPass;

    return NextResponse.json({
      allPassed,
      checks: {
        step1_insert: insertPass ? "PASS" : "FAIL",
        step2_read: readPass ? "PASS" : "FAIL",
        step3_update: updatePass ? "PASS" : "FAIL",
        step4_delete: deletePass ? "PASS" : "FAIL",
        step5_cleanup: cleanupPass ? "PASS" : "FAIL",
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
