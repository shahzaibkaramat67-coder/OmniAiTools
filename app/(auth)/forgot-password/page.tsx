"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Enter your email address"); return; }
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/forgot-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      // Always show success to prevent email enumeration
      setSent(true);
    } catch {
      setSent(true); // still show success
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center text-base font-bold shadow-glow-sm">
            O
          </div>
          <span className="font-display font-700 text-xl text-white">
            Omni<span className="gradient-text">AI</span>Tool
          </span>
        </Link>

        <div className="glass-card rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📬</div>
              <h2 className="font-display text-xl font-700 text-white mb-2">Check your inbox</h2>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                If an account exists for <span className="text-white font-medium">{email}</span>,
                we've sent a password reset link. Check your spam folder too.
              </p>
              <Link
                href="/login"
                className="inline-flex px-6 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-all shadow-glow-sm"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-700 text-white mb-1">Forgot password?</h1>
              <p className="text-slate-400 text-sm mb-8">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
