import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const createFetchContext = async (opts: { req: Request }) => {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  let userId: string | null = null;
  const userIdHeader = opts.req.headers.get("x-user-id");
  if (userIdHeader) {
    userId = userIdHeader;
  }

  return {
    userId,
    userEmail: null,
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
