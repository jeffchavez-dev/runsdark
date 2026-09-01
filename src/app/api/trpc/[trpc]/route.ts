import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const createFetchContext = async (opts: { req: Request }) => {
  // Use ANON key to respect RLS policies
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let userId: string | null = null;
  let userEmail: string | null = null;

  // Extract and validate Bearer token from Authorization header
  const authHeader = opts.req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (!error && user) {
        userId = user.id;
        userEmail = user.email || null;
      }
      // If token is invalid/expired, userId remains null and protectedProcedure will reject
    } catch {
      // Token validation failed; userId remains null
    }
  }

  return {
    userId,
    userEmail,
    supabase,
  } as any;
};

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createFetchContext,
  });

export { handler as GET, handler as POST };
