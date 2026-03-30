import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { getFeaturedTools, TOOLS, CATEGORIES } from "@/lib/tools-data";
import { connectDB } from "@/lib/db";
import History from "@/models/History";
import User from "@/models/User";
import ToolCard from "@/components/dashboard/ToolCard";
import { MotionInView } from "@/components/layout/MotionInView";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";
import { formatRelativeTime } from "@/lib/utils";
import mongoose from "mongoose";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user    = session?.user as any;

  let recentHistory: any[] = [];
  let totalGenerations     = 0;
  let dbUser: any          = null;

  try {
    await connectDB();
    const userId = new mongoose.Types.ObjectId(user?.id);
    [dbUser, recentHistory, totalGenerations] = await Promise.all([
      User.findById(userId).lean(),
      History.find({ userId }).sort({ createdAt: -1 }).limit(6).lean().then((r) => JSON.parse(JSON.stringify(r))),
      History.countDocuments({ userId }),
    ]);
  } catch (_) {}

  const featured = getFeaturedTools().slice(0, 8);
  const credits  = (dbUser as any)?.credits ?? user?.credits ?? 0;
  const plan     = (dbUser as any)?.plan     ?? user?.plan     ?? "free";
  const PLAN_MAX: Record<string, number> = { free: 10, starter: 200, pro: 1000 };
  const creditPct = Math.min(100, (credits / (PLAN_MAX[plan] ?? 10)) * 100);

  const STATS = [
    { label: "Credits left",       value: credits,             icon: "⚡", sub: `${plan} plan` },
    { label: "Generations",         value: totalGenerations,    icon: "📊", sub: "all time"      },
    { label: "Tools available",     value: TOOLS.length,        icon: "🛠️", sub: "& growing"     },
    { label: "Plan",                value: plan.charAt(0).toUpperCase() + plan.slice(1),
      icon: "👑", sub: credits < 5 ? "⚠ Low credits" : "Active" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">

      {/* Welcome */}
      <MotionInView className="mb-10 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-slate-500 text-sm mb-1 font-medium">Good to see you,</p>
          <h1 className="font-display text-3xl font-700 text-white">
            {user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
        </div>
        {credits < 10 && (
          <Link
            href="/pricing"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-300 hover:bg-brand-500/25 text-sm font-medium transition-all animate-pulse-slow"
          >
            ⚡ Top up credits →
          </Link>
        )}
      </MotionInView>

      {/* Stats */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((s, i) => (
          <StaggerItem key={s.label}>
          <div className="glass-card rounded-xl p-5 hover:border-white/10 transition-all h-full">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl">{s.icon}</span>
              {i === 0 && (
                <div className="w-12 h-1.5 bg-surface-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-accent rounded-full"
                    style={{ width: `${creditPct}%` }}
                  />
                </div>
              )}
            </div>
            <div className="font-display text-2xl font-700 text-white mb-0.5">{s.value}</div>
            <div className="text-xs text-slate-500">{s.sub}</div>
          </div>
          </StaggerItem>
        ))}
      </StaggerList>

      {/* Featured tools */}
      <MotionInView className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-600 text-white">Featured Tools</h2>
          <Link href="/tools" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
            View all {TOOLS.length} <span>→</span>
          </Link>
        </div>
        <StaggerList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((tool) => (
            <StaggerItem key={tool.slug}>
              <ToolCard tool={tool} variant="default" />
            </StaggerItem>
          ))}
        </StaggerList>
      </MotionInView>

      {/* Recent history */}
      <MotionInView>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-600 text-white">Recent Activity</h2>
          <Link href="/history" className="text-sm text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1">
            View all <span>→</span>
          </Link>
        </div>

        {recentHistory.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <p className="font-display text-xl font-600 text-white mb-2">Ready to create?</p>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              Pick a tool below and start generating. Your history saves automatically.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-all shadow-glow-sm"
            >
              🛠️ Browse all tools
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentHistory.map((h: any) => {
              const cat = CATEGORIES[h.category as keyof typeof CATEGORIES];
              return (
                <div key={h._id} className="glass-card rounded-xl p-4 flex items-start gap-3 hover:border-white/10 transition-all group">
                  <div className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold mt-0.5 ${cat?.color ?? "text-slate-400"} ${cat?.bg ?? "bg-slate-400/10"}`}>
                    {cat?.label ?? h.category}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors">{h.toolName}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{h.input}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-slate-600 font-mono">{h.creditsUsed}cr</span>
                    <span className="text-[10px] text-slate-700">{formatRelativeTime(h.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </MotionInView>
    </div>
  );
}
