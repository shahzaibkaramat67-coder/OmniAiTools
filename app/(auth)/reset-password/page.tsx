"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";

function ResetForm() {
  const params   = useSearchParams();
  const router   = useRouter();
  const token    = params.get("token")  ?? "";
  const email    = params.get("email")  ?? "";

  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm)   { toast.error("Passwords do not match");            return; }
    if (password.length < 8)    { toast.error("Min. 8 characters required");        return; }
    if (!token || !email)       { toast.error("Invalid reset link");                return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/reset-password", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      toast.success("Password reset! Redirecting…");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition-all";

  return (
    <div className="glass-card rounded-2xl p-8">
      {done ? (
        <div className="text-center py-4">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-xl font-700 text-white mb-2">Password reset!</h2>
          <p className="text-slate-400 text-sm">Redirecting you to sign in…</p>
        </div>
      ) : (
        <>
          <h1 className="font-display text-2xl font-700 text-white mb-1">Set new password</h1>
          <p className="text-slate-400 text-sm mb-8">
            Resetting password for <span className="text-white font-medium">{email}</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                required
                autoFocus
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
                required
                className={inputCls}
              />
            </div>

            {/* Password strength indicator */}
            <div className="space-y-1.5">
              {[
                { label: "8+ characters",     ok: password.length >= 8       },
                { label: "Passwords match",   ok: password === confirm && confirm.length > 0 },
              ].map((rule) => (
                <div key={rule.label} className="flex items-center gap-2">
                  <span className={`text-xs ${rule.ok ? "text-green-400" : "text-slate-600"}`}>
                    {rule.ok ? "✓" : "○"}
                  </span>
                  <span className={`text-xs ${rule.ok ? "text-slate-300" : "text-slate-600"}`}>
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-60 mt-2"
            >
              {loading ? "Resetting…" : "Reset password"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={<div className="glass-card rounded-2xl p-8 text-center text-slate-400">Loading…</div>}>
          <ResetForm />
        </Suspense>
        <p className="text-center text-sm text-slate-500 mt-6">
          <Link href="/login" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">
            ← Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
