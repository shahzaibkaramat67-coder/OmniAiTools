"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function AdminUsersClient({ users: initial }: { users: User[] }) {
  const [users, setUsers] = useState(initial);
  const [search, setSearch] = useState("");
  const [editingCredits, setEditingCredits] = useState<string | null>(null);
  const [creditInput, setCreditInput] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateCredits = async (userId: string) => {
    const amount = parseInt(creditInput);
    if (isNaN(amount)) { toast.error("Enter a valid number"); return; }
    try {
      const res = await fetch("/api/admin/credits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, credits: amount }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, credits: amount } : u))
      );
      toast.success("Credits updated");
      setEditingCredits(null);
    } catch {
      toast.error("Failed to update credits");
    }
  };

  const updatePlan = async (userId: string, plan: string) => {
    try {
      const res = await fetch("/api/admin/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, plan }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, plan } : u))
      );
      toast.success("Plan updated");
    } catch {
      toast.error("Failed to update plan");
    }
  };

  return (
    <div>
      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
        />
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Credits</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">No users found</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u._id} className="border-b border-surface-border last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300 flex-shrink-0">
                          {u.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={u.plan}
                        onChange={(e) => updatePlan(u._id, e.target.value)}
                        className="bg-surface-hover border border-surface-border text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-500/60"
                      >
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      {editingCredits === u._id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={creditInput}
                            onChange={(e) => setCreditInput(e.target.value)}
                            className="w-20 px-2 py-1.5 rounded-lg bg-surface-hover border border-brand-500/40 text-white text-xs focus:outline-none"
                            autoFocus
                          />
                          <button onClick={() => updateCredits(u._id)} className="text-xs text-green-400 hover:text-green-300">✓</button>
                          <button onClick={() => setEditingCredits(null)} className="text-xs text-slate-500 hover:text-white">✕</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingCredits(u._id); setCreditInput(String(u.credits)); }}
                          className="text-white font-medium hover:text-brand-300 transition-colors"
                        >
                          {u.credits}
                          <span className="text-slate-600 text-xs ml-1">✎</span>
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        u.role === "admin"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs ${u.emailVerified ? "text-green-400" : "text-yellow-400"}`}>
                        {u.emailVerified ? "✓ Verified" : "⚠ Unverified"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
