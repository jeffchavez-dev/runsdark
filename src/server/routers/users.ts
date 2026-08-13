import { router, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const usersRouter = router({
  sync: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
    }

    const { data: existingUser } = await ctx.supabase
      .from("users")
      .select("id")
      .eq("supabase_id", ctx.userId)
      .maybeSingle();

    // User already exists
    if (existingUser) {
      return { success: true, created: false };
    }

    // Create new user
    const { data, error } = await ctx.supabase
      .from("users")
      .insert([
        {
          supabase_id: ctx.userId,
          email: ctx.userEmail || "",
        },
      ])
      .select()
      .single();

    if (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    }

    return { success: true, created: true, user: data };
  }),
});
