"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/lib/tools-data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { MotionInView } from "@/components/layout/MotionInView";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";
import { transitions } from "@/lib/motion";

function ToolsContent() {
  const searchParams = useSearchParams();
  const initCat = searchParams.get("category") as ToolCategory | null;

  const [activeCategory, setActiveCategory] = useState<ToolCategory | "all">(initCat ?? "all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchCat = activeCategory === "all" || t.category === activeCategory;
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <MotionInView className="mb-8">
        <h1 className="font-display text-3xl font-700 text-white mb-2">All Tools</h1>
        <p className="text-slate-400 text-sm">{TOOLS.length} AI-powered tools across 7 categories</p>
      </MotionInView>

      {/* Search */}
      <MotionInView className="relative mb-6 max-w-md">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tools…"
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
        />
      </MotionInView>

      {/* Category filters */}
      <MotionInView className="flex items-center gap-2 flex-wrap mb-8">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeCategory === "all"
              ? "bg-brand-500 text-white shadow-glow-sm"
              : "bg-surface-card border border-surface-border text-slate-400 hover:text-white hover:border-white/20"
          }`}
        >
          All ({TOOLS.length})
        </button>
        {(Object.keys(CATEGORIES) as ToolCategory[]).map((cat) => {
          const count = TOOLS.filter((t) => t.category === cat).length;
          const info = CATEGORIES[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat
                  ? `${info.bg} ${info.color} border border-current/30`
                  : "bg-surface-card border border-surface-border text-slate-400 hover:text-white hover:border-white/20"
              }`}
            >
              {info.label} ({count})
            </button>
          );
        })}
      </MotionInView>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-white font-medium mb-1">No tools found</p>
          <p className="text-slate-500 text-sm">Try a different search or category</p>
        </div>
      ) : (
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tool) => {
            const catInfo = CATEGORIES[tool.category];
            return (
              <StaggerItem key={tool.slug}>
              <motion.div className="h-full" whileHover={{ y: -3, transition: transitions.spring }} whileTap={{ scale: 0.99 }}>
              <Link
                href={`/tools/${tool.slug}`}
                className="group glass-card rounded-xl p-5 hover:border-brand-500/30 hover:bg-brand-500/5 transition-colors duration-200 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {tool.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300">
                        {tool.badge}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{tool.credits}cr</span>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-white mb-1 group-hover:text-brand-300 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
                  {tool.description}
                </p>
                <div className="mt-3 pt-3 border-t border-surface-border">
                  <span className={`text-[10px] font-semibold ${catInfo.color} ${catInfo.bg} px-2 py-0.5 rounded`}>
                    {catInfo.label}
                  </span>
                </div>
              </Link>
              </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerList>
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-400">Loading tools…</div>}>
      <ToolsContent />
    </Suspense>
  );
}
