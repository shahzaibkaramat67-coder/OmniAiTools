"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { MotionInView } from "@/components/layout/MotionInView";
import { transitions } from "@/lib/motion";

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const user = session?.user as any;

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", next: "", confirm: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [apiKeys, setApiKeys] = useState({ openai: "", elevenlabs: "", stability: "" });

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name ?? "", email: user.email ?? "" });
    }
  }, [user]);

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 focus:bg-brand-500/5 transition-all";

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name.trim()) { toast.error("Name is required"); return; }
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileForm.name }),
      });
      if (!res.ok) throw new Error("Failed");
      await update({ name: profileForm.name });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) { toast.error("Passwords do not match"); return; }
    if (passwordForm.next.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current: passwordForm.current, next: passwordForm.next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Password updated!");
      setPasswordForm({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  const PLAN_CREDITS: Record<string, number> = { free: 10, starter: 200, pro: 1000 };
  const credits = user?.credits ?? 0;
  const maxCredits = PLAN_CREDITS[user?.plan ?? "free"] || 10;
  const creditPct = Math.min(100, (credits / maxCredits) * 100);

  return (
    <motion.div
      className="p-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.smooth}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display text-3xl font-700 text-white mb-2">Settings</h1>
        <p className="text-slate-400 text-sm">Manage your account, security, and preferences</p>
      </div>

      {/* Plan / credits card */}
      <MotionInView className="glass-card rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-brand-500/15">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Current plan</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              user?.plan === "pro"     ? "bg-accent/20 text-accent-light" :
              user?.plan === "starter" ? "bg-brand-500/20 text-brand-300"  :
              "bg-slate-500/20 text-slate-400"
            }`}>
              {(user?.plan ?? "free").toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-display text-2xl font-700 text-white">{credits}</span>
            <span className="text-slate-400 text-sm">credits remaining</span>
          </div>
          <div className="w-full max-w-xs h-1.5 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent transition-all"
              style={{ width: `${creditPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1">{credits} / {maxCredits} credits</p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <Link
            href="/pricing"
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm text-center"
          >
            Upgrade plan
          </Link>
          <Link
            href="/pricing#packs"
            className="px-5 py-2.5 rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all text-center hover:bg-white/5"
          >
            Buy credits
          </Link>
        </div>
      </MotionInView>

      {/* Profile */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xl font-bold text-brand-300">
            {user?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-display font-600 text-white">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Edit Profile</h2>
        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Full name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className={inputCls}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Email address</label>
            <input
              type="email"
              value={profileForm.email}
              disabled
              className={`${inputCls} opacity-40 cursor-not-allowed`}
            />
            <p className="text-xs text-slate-600 mt-1.5">Email cannot be changed after registration</p>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all disabled:opacity-50 shadow-glow-sm"
            >
              {savingProfile ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Change Password</h2>
        <form onSubmit={savePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Current password</label>
            <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })} className={inputCls} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">New password</label>
            <input type="password" value={passwordForm.next} onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })} className={inputCls} placeholder="Min. 8 characters" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Confirm new password</label>
            <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })} className={inputCls} placeholder="••••••••" />
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" disabled={savingPassword} className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all disabled:opacity-50 shadow-glow-sm">
              {savingPassword ? "Updating…" : "Update password"}
            </button>
          </div>
        </form>
      </section>

      {/* Notification preferences */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">Notifications</h2>
        <div className="space-y-4">
          {[
            { label: "Low credits warning",  desc: "Get notified when credits fall below 10", defaultOn: true  },
            { label: "New tool alerts",      desc: "Be the first to know about new tools",    defaultOn: true  },
            { label: "Monthly usage report", desc: "Summary of your monthly AI usage",        defaultOn: false },
            { label: "Product updates",      desc: "Platform improvements and changelog",     defaultOn: false },
          ].map((pref) => (
            <div key={pref.label} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white font-medium">{pref.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{pref.desc}</p>
              </div>
              <button
                onClick={() => toast.success("Preference saved (wire to backend)")}
                className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors ${
                  pref.defaultOn ? "bg-brand-500" : "bg-surface-border"
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  pref.defaultOn ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* API Keys */}
      <section className="glass-card rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">Your API Keys</h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-accent/20 text-accent-light font-semibold">Pro</span>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Connect your own API keys to bypass credit limits for specific tools. Keys are AES-encrypted.
        </p>
        <div className="space-y-4">
          {[
            { key: "openai",     label: "OpenAI API Key",     placeholder: "sk-..." },
            { key: "elevenlabs", label: "ElevenLabs API Key", placeholder: "el-..." },
            { key: "stability",  label: "Stability AI Key",   placeholder: "sk-..." },
          ].map((item) => (
            <div key={item.key}>
              <label className="block text-sm text-slate-400 mb-1.5">{item.label}</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKeys[item.key as keyof typeof apiKeys]}
                  onChange={(e) => setApiKeys({ ...apiKeys, [item.key]: e.target.value })}
                  placeholder={item.placeholder}
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={() => toast.success("Key saved — add DB storage in /api/user/apikeys")}
                  className="px-4 py-3 rounded-xl border border-surface-border text-slate-400 hover:text-white hover:border-white/20 text-sm transition-all whitespace-nowrap"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="glass-card rounded-2xl p-6 border-red-900/30">
        <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">Danger Zone</h2>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          These actions are irreversible. Please be certain before proceeding.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => toast.error("Export feature coming soon")}
            className="px-5 py-2.5 rounded-xl border border-surface-border text-slate-400 hover:text-white hover:border-white/20 text-sm font-medium transition-all hover:bg-white/5"
          >
            Export my data
          </button>
          <button
            onClick={() => toast.error("Contact support to delete your account")}
            className="px-5 py-2.5 rounded-xl border border-red-500/25 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 text-sm font-medium transition-all"
          >
            Delete account
          </button>
        </div>
      </section>
    </motion.div>
  );
}
