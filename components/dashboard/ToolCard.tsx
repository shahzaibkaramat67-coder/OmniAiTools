import Link from "next/link";
import { type Tool, CATEGORIES } from "@/lib/tools-data";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export default function ToolCard({ tool, variant = "default", className }: ToolCardProps) {
  const catInfo = CATEGORIES[tool.category];

  if (variant === "compact") {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className={cn(
          "group flex items-center gap-3 px-4 py-3 rounded-xl glass-card hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-200",
          className
        )}
      >
        <span className="text-xl flex-shrink-0">{tool.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate group-hover:text-brand-300 transition-colors">
            {tool.name}
          </p>
          <p className="text-xs text-slate-500">{tool.credits} credits</p>
        </div>
        <svg className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/tools/${tool.slug}`}
        className={cn(
          "group relative glass-card rounded-2xl p-6 hover:border-brand-500/40 hover:bg-brand-500/6 transition-all duration-200 hover:-translate-y-1 hover:shadow-glow-sm",
          className
        )}
      >
        {/* Category accent line */}
        <div className={cn("absolute top-0 left-6 right-6 h-px rounded-full opacity-50", {
          "bg-blue-400":   tool.category === "writing",
          "bg-green-400":  tool.category === "seo",
          "bg-pink-400":   tool.category === "social",
          "bg-yellow-400": tool.category === "productivity",
          "bg-orange-400": tool.category === "marketing",
          "bg-purple-400": tool.category === "advanced",
          "bg-red-400":    tool.category === "media",
        })} />

        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-2xl">
            {tool.icon}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {tool.badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300">
                {tool.badge}
              </span>
            )}
            <span className={cn("px-2 py-0.5 rounded text-[10px] font-semibold", catInfo.color, catInfo.bg)}>
              {catInfo.label}
            </span>
          </div>
        </div>

        <h3 className="font-display font-600 text-white text-base mb-1.5 group-hover:text-brand-300 transition-colors">
          {tool.name}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
          {tool.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 font-mono">{tool.credits} credits</span>
          <span className="text-xs text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
            Use tool
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group glass-card rounded-xl p-5 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all duration-200 hover:-translate-y-0.5 flex flex-col",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{tool.icon}</span>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {tool.badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300">
              {tool.badge}
            </span>
          )}
          <span className="text-xs text-slate-500 font-mono">{tool.credits}cr</span>
        </div>
      </div>

      <h3 className="font-semibold text-sm text-white mb-1 group-hover:text-brand-300 transition-colors leading-snug">
        {tool.name}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
        {tool.description}
      </p>

      <div className="mt-3 pt-3 border-t border-surface-border">
        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded", catInfo.color, catInfo.bg)}>
          {catInfo.label}
        </span>
      </div>
    </Link>
  );
}
