import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    const isAuthRoute =
      pathname.startsWith("/login") ||
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/set-password") ||
      pathname.startsWith("/activate");

    const isApiRoute = pathname.startsWith("/api/");

    // Read authenticated Supabase session token
    const sessionToken = request.cookies.get("__Host-farmreem-admin-session")?.value;

    // Allow API routes to pass through unhindered
    if (isApiRoute) {
      const response = NextResponse.next();
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      return response;
    }

    // Handle root / route explicitly
    if (pathname === "/") {
      const targetPath = sessionToken ? "/dashboard" : "/login";
      const redirectUrl = new URL(targetPath, request.url);
      const res = NextResponse.redirect(redirectUrl);
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }

    // If unauthenticated user tries to access protected admin routes -> Redirect to /login
    if (!sessionToken && !isAuthRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }

    // If authenticated user tries to access /login -> Redirect to /dashboard
    if (sessionToken && isAuthRoute) {
      const dashboardUrl = new URL("/dashboard", request.url);
      const res = NextResponse.redirect(dashboardUrl);
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      return res;
    }

    // Inject Security & NOINDEX headers for normal responses
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  } catch (error) {
    // Fail safe to login redirect with noindex header
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
