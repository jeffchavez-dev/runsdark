"use client";

import { Plane, MapPin } from "lucide-react";

export default function TravelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Travel Manager</h1>
        <p className="text-text-secondary mt-2">Executive travel itinerary builder with document storage</p>
      </div>

      <div className="p-12 rounded-lg bg-gradient-to-br from-bg-surface to-bg-border border border-bg-border text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-accent-primary/10 rounded-lg">
            <Plane className="w-12 h-12 text-accent-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Build and manage executive travel itineraries with flights, hotels, cars, and activities. Include documents and get client approval via link.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-accent-primary text-sm font-semibold">
          <MapPin size={16} />
          <span>Itinerary builder · Document storage · PDF export · Approval flow</span>
        </div>

        <div className="pt-4 border-t border-bg-border">
          <p className="text-xs text-text-muted">
            Phase 5 — Travel development begins after Docket and Calendar
          </p>
        </div>
      </div>
    </div>
  );
}
