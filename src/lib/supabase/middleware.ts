import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that are accessible without authentication
const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

// Routes only accessible when NOT authenticated
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

/**
 * Refreshes the Supabase session and enforces route protection.
 * Called by src/proxy.ts on every request.
 */
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase keys are not set up yet in .env.local, skip auth checks safely
  if (!url || !key || url.includes("your-project") || key.includes("your-supabase")) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
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
  });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route);

    // Redirect unauthenticated users to login (except for public routes)
    if (!user && !isPublicRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages → dashboard
    if (user && isAuthRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    // If Supabase connection fails, allow public access without crashing
    console.warn("Supabase auth check skipped (connection issue):", error);
  }

  return supabaseResponse;
}
