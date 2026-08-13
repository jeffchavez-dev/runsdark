"use client";

import { Mail, Sparkles } from "lucide-react";

export default function EDraftingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">EDrafting</h1>
        <p className="text-text-secondary mt-2">AI email drafting that matches your client's voice</p>
      </div>

      <div className="p-12 rounded-lg bg-gradient-to-br from-bg-surface to-bg-border border border-bg-border text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-4 bg-accent-primary/10 rounded-lg">
            <Mail className="w-12 h-12 text-accent-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            We're building an intelligent email drafting assistant powered by Claude AI. Upload your samples, and we'll learn your voice.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-accent-primary text-sm font-semibold">
          <Sparkles size={16} />
          <span>RAG-powered voice profiles · Claude API integration</span>
        </div>

        <div className="pt-4 border-t border-bg-border">
          <p className="text-xs text-text-muted">
            Phase 5 — EDrafting development begins after Calendar and Travel Manager
          </p>
        </div>
      </div>
    </div>
  );
}
