import { router, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const docketRouter = router({
  // List all tasks for a specific client
  listTasks: protectedProcedure
    .input(z.object({ clientId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("tasks")
        .select(
          `
          id,
          title,
          description,
          status,
          priority,
          starred,
          due,
          created_at,
          completed_at,
          user_id,
          client_id,
          subtasks(id, title, done, order),
          task_comments(id, text, created_at)
        `
        )
        .eq("user_id", ctx.userId)
        .eq("client_id", input.clientId)
        .order("created_at", { ascending: false });

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data || [];
    }),

  // Create a new task
  createTask: protectedProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        title: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("tasks")
        .insert([
          {
            user_id: ctx.userId,
            client_id: input.clientId,
            title: input.title,
            description: input.description,
            status: "not_started",
          },
        ])
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),

  // Update task status
  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid(),
        status: z.enum(["not_started", "in_progress", "pending", "action_required", "done"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("tasks")
        .update({
          status: input.status,
          completed_at: input.status === "done" ? new Date().toISOString() : null,
        })
        .eq("id", input.taskId)
        .eq("user_id", ctx.userId)
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),

  // Update task priority
  updateTaskPriority: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid(),
        priority: z.enum(["p0", "p1", "p2"]).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("tasks")
        .update({ priority: input.priority })
        .eq("id", input.taskId)
        .eq("user_id", ctx.userId)
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),

  // Toggle task starred status
  toggleTaskStar: protectedProcedure
    .input(z.object({ taskId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data: task } = await ctx.supabase
        .from("tasks")
        .select("starred")
        .eq("id", input.taskId)
        .eq("user_id", ctx.userId)
        .single();

      const newStarred = task?.starred === "true" ? "false" : "true";

      const { data, error } = await ctx.supabase
        .from("tasks")
        .update({ starred: newStarred })
        .eq("id", input.taskId)
        .eq("user_id", ctx.userId)
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),

  // Delete task
  deleteTask: protectedProcedure
    .input(z.object({ taskId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("tasks")
        .delete()
        .eq("id", input.taskId)
        .eq("user_id", ctx.userId);

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return { success: true };
    }),

  // Add subtask
  addSubtask: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid(),
        title: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("subtasks")
        .insert([
          {
            task_id: input.taskId,
            title: input.title,
            done: "false",
          },
        ])
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),

  // Toggle subtask done
  toggleSubtask: protectedProcedure
    .input(z.object({ subtaskId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { data: subtask } = await ctx.supabase
        .from("subtasks")
        .select("done")
        .eq("id", input.subtaskId)
        .single();

      const newDone = subtask?.done === "true" ? "false" : "true";

      const { data, error } = await ctx.supabase
        .from("subtasks")
        .update({ done: newDone })
        .eq("id", input.subtaskId)
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),

  // Delete subtask
  deleteSubtask: protectedProcedure
    .input(z.object({ subtaskId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { error } = await ctx.supabase
        .from("subtasks")
        .delete()
        .eq("id", input.subtaskId);

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return { success: true };
    }),

  // Add comment
  addComment: protectedProcedure
    .input(
      z.object({
        taskId: z.string().uuid(),
        text: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("task_comments")
        .insert([
          {
            task_id: input.taskId,
            text: input.text,
          },
        ])
        .select()
        .single();

      if (error) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: error.message });
      return data;
    }),
});
