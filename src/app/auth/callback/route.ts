/**
 * Supabase Auth Callback Route.
 *
 * Handles the OAuth redirect and email confirmation callback.
 * Exchanges the `code` in the URL for a Supabase session.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/constants/routes";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Where to redirect after successful auth (defaults to dashboard)
  const next = searchParams.get("next") ?? ROUTES.DASHBOARD;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Auth code missing or exchange failed — redirect to login with error
  return NextResponse.redirect(
    `${origin}/login?message=Authentication failed. Please try again.`
  );
}
