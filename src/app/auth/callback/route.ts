import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/blog";
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${origin}/blog?error=${encodeURIComponent(error)}`,
    );
  }

  if (code) {
    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      // Redirect back to the original page or blog
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If no code or error, redirect to the next page if available, otherwise blog
  const redirectTo = next !== "/blog" ? next : "/blog";
  return NextResponse.redirect(`${origin}${redirectTo}`);
}
