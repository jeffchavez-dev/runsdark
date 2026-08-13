"use client";

import { Calendar, Clock } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Availability Tracker</h1>
        <p className="text-text-secondary mt-2">Calendar booking status dashboard for multiple clients</p>
      </div>

      <div className="p-12 rounded-lg bg-gradient-to-br from-bg-surface to-bg-border border border-bg-border text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-accent-primary/10 rounded-lg">
            <Calendar className="w-12 h-12 text-accent-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Track booking statuses across all your client calendars. View confirmed, pending, needs follow-up, and conflicting meetings in one place.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-accent-primary text-sm font-semibold">
          <Clock size={16} />
          <span>Google Calendar sync · Status management · Notifications</span>
        </div>

        <div className="pt-4 border-t border-bg-border">
          <p className="text-xs text-text-muted">
            Phase 5 — Calendar development begins after Docket and EDrafting
          </p>
        </div>
      </div>
    </div>
  );
}
