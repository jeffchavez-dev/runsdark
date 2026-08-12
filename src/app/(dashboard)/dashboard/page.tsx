import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="p-6 rounded-lg bg-bg-surface border border-bg-border">
          <p className="text-text-secondary text-sm">Active Tasks</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
        </div>
        <div className="p-6 rounded-lg bg-bg-surface border border-bg-border">
          <p className="text-text-secondary text-sm">Upcoming Bookings</p>
          <p className="text-3xl font-bold text-white mt-2">0</p>
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
