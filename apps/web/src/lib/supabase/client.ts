import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      domain: process.env.NODE_ENV === "development" ? undefined : ".runsdark.com",
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  });

  return client;
}
