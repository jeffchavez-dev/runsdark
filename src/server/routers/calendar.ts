import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getPublicUserId } from "@/server/utils/user-lookup";

const bookingStatusEnum = z.enum([
  "confirmed",
  "pending",
  "needs_followup",
  "rescheduled",
  "cancelled",
  "conflict",
]);

export const calendarRouter = router({
  // List bookings for a client with optional status filter
  listBookings: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        status: bookingStatusEnum.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);

      let query = ctx.supabase
        .from("bookings")
        .select("*")
        .eq("user_id", publicUserId)
        .eq("client_id", input.clientId)
        .order("start_time", { ascending: true });

      if (input.status) {
        query = query.eq("status", input.status);
      }

      const { data, error } = (await query) as any;

      if (error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return (data || []) as any;
    }),

  // Create a new booking
  createBooking: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        title: z.string().min(1).max(255),
        startTime: z.string().datetime().optional(),
        endTime: z.string().datetime().optional(),
        notes: z.string().optional(),
        platform: z.enum(["google", "ghl", "manual"]).default("manual"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);

      const bookingData: any = {
        user_id: publicUserId,
        client_id: input.clientId,
        title: input.title,
        start_time: input.startTime ? new Date(input.startTime).toISOString() : null,
        end_time: input.endTime ? new Date(input.endTime).toISOString() : null,
        notes: input.notes || null,
        platform: input.platform,
        status: "pending",
      };

      const { data, error } = (await ctx.supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single()) as any;

      if (error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data as any;
    }),

  // Update booking details (not status — use updateStatus for that)
  updateBooking: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        startTime: z.string().datetime().optional(),
        endTime: z.string().datetime().optional(),
        notes: z.string().optional(),
        followUpAt: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);
      const { id, startTime, endTime, followUpAt, ...updates } = input;

      const updateData: Record<string, any> = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      if (startTime) updateData.start_time = new Date(startTime).toISOString();
      if (endTime) updateData.end_time = new Date(endTime).toISOString();
      if (followUpAt) updateData.follow_up_at = new Date(followUpAt).toISOString();

      const { data, error } = (await ctx.supabase
        .from("bookings")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", publicUserId)
        .select()
        .single()) as any;

      if (error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data as any;
    }),

  // Update booking status and log the transition
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        newStatus: bookingStatusEnum,
        note: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);

      // Get current booking to find old status
      const { data: currentBooking, error: fetchError } = (await ctx.supabase
        .from("bookings")
        .select("status")
        .eq("id", input.id)
        .eq("user_id", publicUserId)
        .single()) as any;

      if (fetchError)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: fetchError.message });

      // Update booking status
      const { data: updatedBooking, error: updateError } = (await ctx.supabase
        .from("bookings")
        .update({
          status: input.newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .eq("user_id", publicUserId)
        .select()
        .single()) as any;

      if (updateError)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: updateError.message });

      // Log the status transition
      if (currentBooking.status !== input.newStatus) {
        const { error: historyError } = (await ctx.supabase.from("booking_history").insert([
          {
            booking_id: input.id,
            old_status: currentBooking.status,
            new_status: input.newStatus,
            note: input.note || null,
          },
        ])) as any;

        if (historyError) {
          console.error("Failed to log booking status change:", historyError);
          // Don't fail the mutation, but log the error
        }
      }

      return updatedBooking;
    }),

  // Get booking status history
  getBookingHistory: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);

      // Verify the booking belongs to this user
      const { data: booking, error: bookingError } = (await ctx.supabase
        .from("bookings")
        .select("id")
        .eq("id", input.id)
        .eq("user_id", publicUserId)
        .single()) as any;

      if (bookingError || !booking)
        throw new TRPCError({ code: "NOT_FOUND", message: "Booking not found" });

      const { data, error } = (await ctx.supabase
        .from("booking_history")
        .select("*")
        .eq("booking_id", input.id)
        .order("changed_at", { ascending: false })) as any;

      if (error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return (data || []) as any;
    }),

  // Delete a booking
  deleteBooking: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const publicUserId = await getPublicUserId(ctx.supabase, ctx.userId);

      const { error } = await ctx.supabase
        .from("bookings")
        .delete()
        .eq("id", input.id)
        .eq("user_id", publicUserId);

      if (error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return { success: true };
    }),
});
