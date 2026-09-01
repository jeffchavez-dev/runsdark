import { TRPCError } from "@trpc/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getPublicUserId(
  supabase: SupabaseClient,
  authUserId: string | null
): Promise<string> {
  if (!authUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id")
    .eq("supabase_id", authUserId)
    .maybeSingle();

  if (error) {
    console.error("[getPublicUserId] Query error:", error);
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to verify user" });
  }

  const publicUserId = user?.id;
  if (!publicUserId) {
    console.error("[getPublicUserId] User profile not found");
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User profile not found" });
  }

  return publicUserId;
}
