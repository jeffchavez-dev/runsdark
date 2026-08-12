"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) {
      setMessage(decodeURIComponent(msg));
    }
  }, [searchParams]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // On successful login, redirect to dashboard
      router.push("/app/dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">RunsDark</h1>
          <p className="text-text-secondary">Sign in to your account</p>
        </div>

        {message && (
          <div className="p-3 rounded-lg bg-status-success/10 border border-status-success/20 text-status-success text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg bg-bg-surface border border-bg-border text-white placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-bg-surface border border-bg-border text-white placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-accent-primary text-white rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-text-secondary text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-accent-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
