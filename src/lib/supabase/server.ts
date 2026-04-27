import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Server-side Supabase client. Reads/writes auth cookies on every request.
// Use inside server components, route handlers, and the proxy.
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          try {
            for (const { name, value, options } of toSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // setAll is no-op in pure server components; safe to ignore.
          }
        },
      },
    }
  );
}
