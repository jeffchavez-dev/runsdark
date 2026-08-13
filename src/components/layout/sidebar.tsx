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
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "EDrafting", href: "/edrafting", icon: Mail },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Travel", href: "/travel", icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isCollapsed, setIsCollapsed] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className={`bg-bg-surface border-r border-bg-border h-screen flex flex-col transition-all duration-300 ${
      isCollapsed ? "w-20" : "w-60"
    }`}>
      {/* Logo & Collapse Button */}
      <div className="p-4 border-b border-bg-border flex items-center justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="text-xl font-bold text-white">
            RunsDark
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-bg-border rounded-lg transition-colors text-text-secondary hover:text-white flex-shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className="w-5 h-5 transition-transform"
            style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors justify-center ${
                isCollapsed ? "w-16" : ""
              } ${
                isActive
                  ? "bg-bg-border text-white"
                  : "text-text-secondary hover:bg-bg-border hover:text-white"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-bg-border">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-text-secondary hover:bg-bg-border hover:text-white transition-colors ${
            isCollapsed ? "w-16 justify-center" : "w-full"
          }`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
