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
  // Use ANON key to respect RLS policies
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let userId: string | null = null;
  let userEmail: string | null = null;

  // Extract and validate Bearer token from Authorization header
  if (opts?.req) {
    const authHeader = (opts.req.headers as any).get?.("Authorization") || (opts.req as any).headers?.["authorization"];
    if (authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
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
      } catch {
        // Token validation failed; userId remains null
      }
    }
  }

  return {
    userId,
    userEmail,
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
