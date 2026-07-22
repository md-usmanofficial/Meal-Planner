import { type NextRequest, NextResponse } from "next/server";

// Routes that are accessible without authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
// Routes only accessible when NOT authenticated
const AUTH_ONLY_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

/**
 * Next.js proxy (Next.js 16+) — session refresh + route protection.
 *
 * - If Supabase env vars are not configured yet, passes all traffic through
 *   so the app is still navigable in local development without credentials.
 * - In production, missing env vars will surface as a clear startup error.
 */
export async function proxy(request: NextRequest) {
  // Gracefully skip auth checks when env vars are not yet configured.
  // This allows the landing page and auth routes to render during initial setup.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next({ request });
  }

  // Dynamically import to avoid module-level crash when env vars are missing
  const { createServerClient } = await import("@supabase/ssr");

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — IMPORTANT: no logic between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname === r);
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((r) => pathname === r);

  // Unauthenticated → redirect to login (except public routes)
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Authenticated → redirect away from auth pages to dashboard
  if (user && isAuthOnlyRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
