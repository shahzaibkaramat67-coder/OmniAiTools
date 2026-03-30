"use client";
import { useState } from "react";
import { TOOLS, CATEGORIES, type Tool, type ToolCategory } from "@/lib/tools-data";
import toast from "react-hot-toast";
import Link from "next/link";
import { motion } from "framer-motion";
import { MotionInView } from "@/components/layout/MotionInView";
import { transitions } from "@/lib/motion";

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>(TOOLS);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<ToolCategory | "all">("all");

  const filtered = tools.filter((t) => {
    const matchCat = filterCat === "all" || t.category === filterCat;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <motion.div
      className="p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transitions.smooth}
    >
      <MotionInView className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-700 text-white mb-1">Tools Management</h1>
          <p className="text-slate-400 text-sm">{tools.length} tools configured</p>
        </div>
        <button
          onClick={() => toast.success("Add tool modal — wire to DB for dynamic tools")}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm flex-shrink-0"
        >
          + Add tool
        </button>
      </MotionInView>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value as any)}
          className="px-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-slate-300 text-sm focus:outline-none focus:border-brand-500/60"
        >
          <option value="all">All categories</option>
          {(Object.keys(CATEGORIES) as ToolCategory[]).map((c) => (
            <option key={c} value={c}>{CATEGORIES[c].label}</option>
          ))}
        </select>
      </div>

      {/* Tools table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {["Tool", "Category", "Credits", "Slug", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tool) => {
                const catInfo = CATEGORIES[tool.category];
                return (
                  <tr key={tool.slug} className="border-b border-surface-border last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl flex-shrink-0">{tool.icon}</span>
                        <div>
                          <p className="font-medium text-white">{tool.name}</p>
                          <p className="text-xs text-slate-500 max-w-[200px] truncate">{tool.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${catInfo.color} ${catInfo.bg}`}>
                        {catInfo.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm text-brand-300">{tool.credits}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-slate-500 bg-surface-hover px-2 py-1 rounded">
                        {tool.slug}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        tool.isMedia ? "bg-yellow-400/10 text-yellow-400" : "bg-green-400/10 text-green-400"
                      }`}>
                        {tool.isMedia ? "Media" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tools/${tool.slug}`}
                          target="_blank"
                          className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                        >
                          Preview
                        </Link>
                        <button
                          onClick={() => toast.success("Edit tool — wire to dynamic tool DB")}
                          className="text-xs text-slate-500 hover:text-white transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => toast.error("Are you sure? (confirm modal)")}
                          className="text-xs text-red-500 hover:text-red-400 transition-colors"
                        >
                          Disable
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
