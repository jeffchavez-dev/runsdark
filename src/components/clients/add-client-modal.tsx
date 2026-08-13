"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { X } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const createClient = trpc.clients.createClient.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setCompany("");
      onSuccess();
      onClose();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createClient.mutateAsync({
        name,
        email: email || undefined,
        company: company || undefined,
      });
    } catch (err) {
      setError("Failed to create client");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-surface rounded-lg p-6 w-full max-w-md mx-4 border border-bg-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-text-secondary mb-2">Client Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              className="w-full px-4 py-2 rounded-lg bg-bg-base border border-bg-border text-white placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-4 py-2 rounded-lg bg-bg-base border border-bg-border text-white placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc"
              className="w-full px-4 py-2 rounded-lg bg-bg-base border border-bg-border text-white placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-bg-border text-text-secondary hover:bg-bg-base transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-accent-primary text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
              disabled={isLoading || !name}
            >
              {isLoading ? "Creating..." : "Create Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
