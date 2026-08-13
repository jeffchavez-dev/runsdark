import { initTRPC, TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

interface Context {
  userId: string | null;
  userEmail: string | null;
  supabase: ReturnType<typeof createSupabaseClient>;
}

export async function createContext(
  opts?: CreateNextContextOptions
): Promise<Context> {
  // Use service role key for tRPC operations
  // This bypasses auth session issues and allows us to query the database
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Extract user ID from request headers sent by the client
  let userId: string | null = null;
  const userIdHeader = opts?.req?.headers.get?.("x-user-id");
  if (userIdHeader) {
    userId = userIdHeader;
  }

  return {
    userId,
    userEmail: null,
    supabase,
  };
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
