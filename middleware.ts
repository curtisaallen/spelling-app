// middleware.ts (or src/middleware.ts)
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: any) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Touch the session so auth cookies get refreshed
  await supabase.auth.getSession();
  return res;
}

export const config = {
  // run on all routes except static assets; tweak to your needs
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
