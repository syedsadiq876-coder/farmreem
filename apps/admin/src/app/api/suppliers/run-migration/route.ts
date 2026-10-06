import { NextResponse } from "next/server";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET() {
  try {
    const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getDatabaseConfig();

    const serviceKey = supabaseServiceKey || supabaseAnonKey;

    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Schema fetch failed: ${res.status}` }, { status: res.status });
    }

    const schema = await res.json();
    const paths = Object.keys(schema.paths || {});
    const tables = paths.map((p) => p.replace(/^\//, "")).filter((p) => p && !p.startsWith("rpc/"));
    const rpcs = paths.filter((p) => p.startsWith("/rpc/")).map((p) => p.replace(/^\/rpc\//, ""));

    return NextResponse.json({
      status: "SUCCESS",
      tableCount: tables.length,
      tables,
      rpcCount: rpcs.length,
      rpcs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Schema check failed" }, { status: 500 });
  }
}
