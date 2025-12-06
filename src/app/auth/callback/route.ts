import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next");
  const error = searchParams.get("error");

  // If next is missing, empty, or invalid, default to /blog
  // Never redirect to home page (/)
  if (!next || next === "/" || !next.startsWith("/")) {
    next = "/blog";
  }

  // Ensure we're redirecting to a valid path (blog post or blog listing)
  // If next doesn't start with /blog, default to /blog
  if (!next.startsWith("/blog")) {
    next = "/blog";
  }

  if (error) {
    return NextResponse.redirect(
      `${origin}/blog?error=${encodeURIComponent(error)}`,
    );
  }

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      // Always redirect to a valid path (never to /)
      // The client-side will check sessionStorage as a fallback
      const response = NextResponse.redirect(`${origin}${next}`);
      // Set a cookie with the redirect path as additional backup
      response.cookies.set("auth_redirect_path", next, {
        maxAge: 60, // 60 seconds
        httpOnly: false,
        sameSite: "lax",
      });
      return response;
    }
  }

  // Fallback: always redirect to blog (never to /)
  return NextResponse.redirect(`${origin}${next}`);
}
