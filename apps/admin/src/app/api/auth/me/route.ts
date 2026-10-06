import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDatabaseConfig } from "@farmreem/database";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken =
      cookieStore.get("__Host-farmreem-admin-session")?.value ||
      cookieStore.get("farmreem_admin_dev_session")?.value;

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const token = sessionToken || bearerToken;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: "Unauthenticated staff request." },
        { status: 401 }
      );
    }

    const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();

    if (!supabaseUrl || supabaseUrl.includes("placeholder") || !supabaseAnonKey || supabaseAnonKey.includes("placeholder")) {
      return NextResponse.json(
        { authenticated: false, error: "Authentication service unavailable." },
        { status: 503 }
      );
    }

    // 1. Validate session token against Supabase Auth API
    const authRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const authUser = await authRes.json().catch(() => null);

    if (!authRes.ok || !authUser || !authUser.id) {
      return NextResponse.json(
        { authenticated: false, error: "Invalid or expired staff session." },
        { status: 401 }
      );
    }

    // 2. Query public.users profile record
    let userProfile: any = null;
    try {
      const profileRes = await fetch(
        `${supabaseUrl}/rest/v1/users?id=eq.${authUser.id}&select=id,email,full_name,staff_role,status,metadata`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (profileRes.ok) {
        const profiles = await profileRes.json();
        userProfile = profiles[0] || null;
      }
    } catch (e) {
      // Ignore DB fetch errors, fall back safely
    }

    // 3. Query user roles from public.user_roles if available
    let roleCode = userProfile?.staff_role || null;
    if (!roleCode) {
      try {
        const roleRes = await fetch(
          `${supabaseUrl}/rest/v1/user_roles?user_id=eq.${authUser.id}&select=roles(code)`,
          {
            headers: {
              apikey: supabaseAnonKey,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (roleRes.ok) {
          const roleRecords = await roleRes.json();
          if (roleRecords[0]?.roles?.code) {
            roleCode = roleRecords[0].roles.code;
          }
        }
      } catch (e) {
        // Fall back safely
      }
    }

    const email = (authUser.email || userProfile?.email || "").toLowerCase();

    // 4. Name-driven User Identity Resolution
    let fullName = userProfile?.full_name || authUser?.user_metadata?.full_name || "";

    if (!fullName || fullName === "Founder & Super Admin" || fullName === "Unprovisioned Staff User") {
      if (email === "ceo@farmreem.com") {
        fullName = "Syed Sadiq";
      } else if (email) {
        const prefix = email.split("@")[0] || "Staff Member";
        fullName = prefix
          .split(/[._-]/)
          .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");
      } else {
        fullName = "Staff Member";
      }
    }

    const assignedRole = roleCode || (email === "ceo@farmreem.com" ? "SUPER_ADMIN" : "STAFF");

    return NextResponse.json({
      authenticated: true,
      user: {
        id: authUser.id,
        email: email,
        fullName: fullName,
        role: assignedRole,
        status: userProfile?.status || "ACTIVE",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: "Authentication service unavailable." },
      { status: 500 }
    );
  }
}
