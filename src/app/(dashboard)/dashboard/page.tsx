import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let clientsCount = 0;
  let tasksCount = 0;
  let bookingsCount = 0;

  if (user) {
    try {
      // Get public user ID
      const { data: publicUser } = await supabase
        .from("users")
        .select("id")
        .eq("supabase_id", user.id)
        .single();

      if (publicUser) {
        // Get clients count
        const { count: clientCount } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .eq("user_id", publicUser.id);

        clientsCount = clientCount || 0;

        // Get active tasks count (not done)
        const { count: taskCount } = await supabase
          .from("tasks")
          .select("*", { count: "exact", head: true })
          .eq("user_id", publicUser.id)
          .neq("status", "done");

        tasksCount = taskCount || 0;

        // Get upcoming bookings count (pending or confirmed)
        const { count: bookingCount } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", publicUser.id)
          .in("status", ["pending", "confirmed"]);

        bookingsCount = bookingCount || 0;
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Welcome back, {user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats cards */}
        <div className="p-6 rounded-lg bg-bg-surface border border-bg-border">
          <p className="text-text-secondary text-sm">Clients</p>
          <p className="text-3xl font-bold text-white mt-2">{clientsCount}</p>
        </div>
        <div className="p-6 rounded-lg bg-bg-surface border border-bg-border">
          <p className="text-text-secondary text-sm">Active Tasks</p>
          <p className="text-3xl font-bold text-white mt-2">{tasksCount}</p>
        </div>
        <div className="p-6 rounded-lg bg-bg-surface border border-bg-border">
          <p className="text-text-secondary text-sm">Upcoming Bookings</p>
          <p className="text-3xl font-bold text-white mt-2">{bookingsCount}</p>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-bg-surface border border-bg-border">
        <h2 className="text-xl font-semibold text-white mb-4">Getting Started</h2>
        <ul className="space-y-2 text-text-secondary">
          <li>✓ Create your first client</li>
          <li>✓ Set up EDrafting with your voice profile</li>
          <li>✓ Connect your calendar</li>
          <li>✓ Create your first task</li>
        </ul>
      </div>
    </div>
  );
}
