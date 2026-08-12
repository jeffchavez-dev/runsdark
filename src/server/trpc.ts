import { initTRPC, TRPCError } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { createClient } from "@/lib/supabase/server";

interface Context {
  userId: string | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
}

export async function createContext(
  opts?: CreateNextContextOptions
): Promise<Context> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    userId: session?.user.id || null,
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
