import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getPublicUserId } from "@/server/utils/user-lookup";

export const clientsRouter = router({
  listClients: protectedProcedure.query(async ({ ctx }) => {
    const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);

    const { data, error } = await ctx.supabase
      .from("clients")
      .select("*")
      .eq("user_id", publicUserId)
      .order("created_at", { ascending: false });

    if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
    return data || [];
  }),

  createClient: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        email: z.string().email().optional(),
        company: z.string().max(255).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);

      const { data, error } = await ctx.supabase
        .from("clients")
        .insert([
          {
            user_id: publicUserId,
            name: input.name,
            email: input.email || null,
            company: input.company || null,
          },
        ])
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),

  updateClient: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(255).optional(),
        email: z.string().email().optional(),
        company: z.string().max(255).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);
      const { id, ...updates } = input;

      const { data, error } = await ctx.supabase
        .from("clients")
        .update(updates)
        .eq("id", id)
        .eq("user_id", publicUserId)
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),

  deleteClient: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);

      const { error } = await ctx.supabase
        .from("clients")
        .delete()
        .eq("id", input.id)
        .eq("user_id", publicUserId);

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return { success: true };
    }),
});
