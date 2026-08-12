"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Mail,
  Calendar,
  Briefcase,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/app/clients", icon: Users },
  { label: "EDrafting", href: "/app/edrafting", icon: Mail },
  { label: "Calendar", href: "/app/calendar", icon: Calendar },
  { label: "Travel", href: "/app/travel", icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="w-60 bg-bg-surface border-r border-bg-border h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-bg-border">
        <Link href="/app/dashboard" className="text-xl font-bold text-white">
          RunsDark
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-bg-border text-white"
                  : "text-text-secondary hover:bg-bg-border hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-bg-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-text-secondary hover:bg-bg-border hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
