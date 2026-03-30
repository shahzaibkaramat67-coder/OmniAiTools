"use client";
import { useState } from "react";
import toast from "react-hot-toast";

interface Stats {
  totalCreditsUsed: number;
  totalCreditsInCirculation: number;
  avgPerUser: number;
}

interface PlanRow {
  _id: string;
  count: number;
  totalCredits: number;
}

export default function AdminCreditsClient({
  stats,
  planBreakdown,
}: {
  stats: Stats;
  planBreakdown: PlanRow[];
}) {
  const [bulkUserId, setBulkUserId] = useState("");
  const [bulkAmount, setBulkAmount] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const grantCredits = async () => {
    if (!bulkUserId.trim() || !bulkAmount.trim()) {
      toast.error("Enter a user ID and amount");
      return;
    }
    setBulkLoading(true);
    try {
      const res = await fetch("/api/admin/credits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: bulkUserId, credits: parseInt(bulkAmount) }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Granted ${bulkAmount} credits`);
      setBulkUserId("");
      setBulkAmount("");
    } catch {
      toast.error("Failed to grant credits");
    } finally {
      setBulkLoading(false);
    }
  };

  const STAT_CARDS = [
    { label: "Total Credits Used",          value: stats.totalCreditsUsed.toLocaleString(),         icon: "🔥" },
    { label: "Credits In Circulation",       value: stats.totalCreditsInCirculation.toLocaleString(), icon: "⚡" },
    { label: "Avg Credits Per User",         value: stats.avgPerUser.toLocaleString(),               icon: "📊" },
  ];

  const PLAN_COLOR: Record<string, string> = {
    free:    "bg-slate-500/20 text-slate-400",
    starter: "bg-brand-500/20 text-brand-300",
    pro:     "bg-accent/20 text-accent-light",
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-6">
            <div className="text-2xl mb-3">{s.icon}</div>
            <div className="font-display text-3xl font-700 text-white mb-1">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Plan breakdown */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-600 text-white mb-5">Credits by Plan</h2>
          {planBreakdown.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No data yet</p>
          ) : (
            <div className="space-y-4">
              {planBreakdown.map((row) => {
                const maxCredits = Math.max(...planBreakdown.map((r) => r.totalCredits), 1);
                const pct = Math.round((row.totalCredits / maxCredits) * 100);
                return (
                  <div key={row._id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${PLAN_COLOR[row._id] ?? "bg-slate-500/20 text-slate-400"}`}>
                          {(row._id ?? "free").toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400">{row.count} users</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{row.totalCredits.toLocaleString()} cr</span>
                    </div>
                    <div className="w-full h-2 bg-surface-border rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Manual grant */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-display font-600 text-white mb-2">Grant Credits Manually</h2>
          <p className="text-xs text-slate-500 mb-5">
            Paste a user's MongoDB ObjectId and the number of credits to set (not add).
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">User ID</label>
              <input
                type="text"
                value={bulkUserId}
                onChange={(e) => setBulkUserId(e.target.value)}
                placeholder="66f3a1b2c3d4e5f6a7b8c9d0"
                className="w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">New credit balance</label>
              <input
                type="number"
                value={bulkAmount}
                onChange={(e) => setBulkAmount(e.target.value)}
                placeholder="e.g. 500"
                min={0}
                className="w-full px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
              />
            </div>
            <button
              onClick={grantCredits}
              disabled={bulkLoading}
              className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all disabled:opacity-50 shadow-glow-sm"
            >
              {bulkLoading ? "Updating…" : "Set credits"}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-surface-border">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Quick top-up presets</p>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 200, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBulkAmount(String(amount))}
                  className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                    bulkAmount === String(amount)
                      ? "border-brand-500 bg-brand-500/20 text-brand-300"
                      : "border-surface-border text-slate-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
