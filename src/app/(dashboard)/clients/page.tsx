"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email?: string;
  company?: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const loadClients = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          setError(error.message);
          return;
        }

        setClients(data || []);
      } catch (err) {
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-text-secondary">Loading clients...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Clients</h1>
          <p className="text-text-secondary mt-2">
            Manage all your clients and their tasks in one place
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-smooth">
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-status-danger/10 border border-status-danger/20 text-status-danger">
          {error}
        </div>
      )}

      {clients.length === 0 ? (
        <div className="p-12 rounded-lg bg-bg-surface border border-bg-border text-center">
          <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Clients Yet</h2>
          <p className="text-text-secondary mb-6">
            Create your first client to start managing tasks
          </p>
          <button className="px-4 py-2 bg-accent-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-smooth">
            Add Your First Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/app/docket/${client.id}`}
              className="p-6 rounded-lg bg-bg-surface border border-bg-border hover:border-accent-primary/30 transition-colors cursor-pointer group"
            >
              <h3 className="text-lg font-semibold text-white group-hover:text-accent-primary transition-colors">
                {client.name}
              </h3>
              {client.company && (
                <p className="text-sm text-text-secondary mt-1">{client.company}</p>
              )}
              {client.email && (
                <p className="text-xs text-text-muted mt-2">{client.email}</p>
              )}
              <p className="text-xs text-text-muted mt-4">
                Click to view tasks →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
