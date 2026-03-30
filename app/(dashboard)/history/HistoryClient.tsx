"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CATEGORIES } from "@/lib/tools-data";
import { copyToClipboard, formatRelativeTime, truncate } from "@/lib/utils";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";

interface HistoryItem {
  _id: string;
  toolSlug: string;
  toolName: string;
  category: string;
  input: string;
  output: string;
  creditsUsed: number;
  createdAt: string;
}

export default function HistoryClient({ history }: { history: HistoryItem[] }) {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return history.filter((h) => {
      const matchCat = filterCat === "all" || h.category === filterCat;
      const matchSearch =
        !search ||
        h.toolName.toLowerCase().includes(search.toLowerCase()) ||
        h.input.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [history, search, filterCat]);

  const usedCats = [...new Set(history.map((h) => h.category))];

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    toast.success("Copied!");
  };

  if (history.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="text-5xl mb-4">📜</div>
        <h3 className="font-display text-xl font-600 text-white mb-2">No history yet</h3>
        <p className="text-slate-400 text-sm mb-6">Start using tools and your generations will appear here.</p>
        <Link
          href="/tools"
          className="inline-flex px-6 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-colors shadow-glow-sm"
        >
          Browse tools →
        </Link>
      </div>
    );
  }

  return (
    <div>
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
            placeholder="Search history…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-surface-card border border-surface-border text-slate-300 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
        >
          <option value="all">All categories</option>
          {usedCats.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORIES[cat as keyof typeof CATEGORIES]?.label ?? cat}
            </option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-slate-600 mb-4">{filtered.length} results</p>

      {/* List */}
      <StaggerList className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">No results found</div>
        ) : (
          filtered.map((h) => {
            const catInfo = CATEGORIES[h.category as keyof typeof CATEGORIES];
            const isOpen = expanded === h._id;
            return (
              <StaggerItem key={h._id}>
              <div className="glass-card rounded-xl overflow-hidden transition-all">
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isOpen ? null : h._id)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold ${catInfo?.color ?? "text-slate-400"} ${catInfo?.bg ?? "bg-slate-400/10"}`}>
                    {catInfo?.label ?? h.category}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{h.toolName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{truncate(h.input, 80)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-slate-500">{h.creditsUsed}cr</span>
                    <span className="text-xs text-slate-600">{formatRelativeTime(h.createdAt)}</span>
                    <svg
                      className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-surface-border px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Input</p>
                      <p className="text-sm text-slate-300 leading-relaxed bg-surface-hover rounded-lg p-3 whitespace-pre-wrap">
                        {h.input}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Output</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(h.output)}
                            className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                          >
                            Copy
                          </button>
                          <Link
                            href={`/tools/${h.toolSlug}`}
                            className="text-xs text-slate-500 hover:text-white transition-colors"
                          >
                            Reuse tool →
                          </Link>
                        </div>
                      </div>
                      <pre className="text-sm text-slate-300 leading-relaxed bg-surface-hover rounded-lg p-3 whitespace-pre-wrap font-sans max-h-64 overflow-auto">
                        {h.output}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
              </StaggerItem>
            );
          })
        )}
      </StaggerList>
    </div>
  );
}
