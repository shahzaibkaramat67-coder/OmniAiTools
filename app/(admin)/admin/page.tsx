import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";
import { TOOLS } from "@/lib/tools-data";
import Link from "next/link";
import { MotionInView } from "@/components/layout/MotionInView";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";

export default async function AdminPage() {
  let stats = { users: 0, generations: 0, creditsUsed: 0, revenue: 0 };
  let recentUsers: any[] = [];
  let topTools: any[] = [];

  try {
    await connectDB();
    const [userCount, genCount, creditAgg, newUsers, toolAgg] = await Promise.all([
      User.countDocuments(),
      History.countDocuments(),
      History.aggregate([{ $group: { _id: null, total: { $sum: "$creditsUsed" } } }]),
      User.find().sort({ createdAt: -1 }).limit(5).lean(),
      History.aggregate([
        { $group: { _id: "$toolSlug", count: { $sum: 1 }, credits: { $sum: "$creditsUsed" } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);
    stats.users       = userCount;
    stats.generations = genCount;
    stats.creditsUsed = creditAgg[0]?.total ?? 0;
    recentUsers       = JSON.parse(JSON.stringify(newUsers));
    topTools          = JSON.parse(JSON.stringify(toolAgg));
  } catch (_) {}

  const STAT_CARDS = [
    { label: "Total Users",       value: stats.users,                       icon: "👥", delta: "+12%" },
    { label: "Total Generations", value: stats.generations.toLocaleString(), icon: "⚡", delta: "+24%" },
    { label: "Credits Used",      value: stats.creditsUsed.toLocaleString(), icon: "🪙", delta: "+18%" },
    { label: "Tools Available",   value: TOOLS.length,                       icon: "🛠️", delta: "stable" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <MotionInView className="mb-10">
        <h1 className="font-display text-3xl font-700 text-white mb-1">Admin Overview</h1>
        <p className="text-slate-400 text-sm">Platform health and key metrics</p>
      </MotionInView>

      {/* Stats grid */}
      <StaggerList className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STAT_CARDS.map((s) => (
          <StaggerItem key={s.label}>
            <div className="glass-card rounded-xl p-5 h-full">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{s.icon}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.delta === "stable" ? "bg-slate-500/20 text-slate-400" : "bg-green-400/10 text-green-400"}`}>
                  {s.delta}
                </span>
              </div>
              <div className="font-display text-2xl font-700 text-white mb-0.5">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>

      <StaggerList className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent users */}
        <StaggerItem>
        <div className="glass-card rounded-2xl p-6 h-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-600 text-white">Recent Users</h2>
            <Link href="/admin/users" className="text-xs text-brand-400 hover:text-brand-300">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No users yet</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u._id} className="flex items-center gap-3 py-2 border-b border-surface-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300 flex-shrink-0">
                    {u.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{u.name}</p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      u.plan === "pro" ? "bg-accent/20 text-accent-light" :
                      u.plan === "starter" ? "bg-brand-500/20 text-brand-300" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>
                      {u.plan}
                    </span>
                    <span className="text-[10px] text-slate-600">{u.credits}cr</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </StaggerItem>

        {/* Top tools */}
        <StaggerItem>
        <div className="glass-card rounded-2xl p-6 h-full">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-600 text-white">Top Tools</h2>
            <Link href="/admin/tools" className="text-xs text-brand-400 hover:text-brand-300">Manage →</Link>
          </div>
          <div className="space-y-3">
            {topTools.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No data yet</p>
            ) : (
              topTools.map((t, i) => {
                const toolDef = TOOLS.find((td) => td.slug === t._id);
                const maxCount = topTools[0]?.count ?? 1;
                const pct = Math.round((t.count / maxCount) * 100);
                return (
                  <div key={t._id} className="py-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600 w-4 text-right">{i + 1}</span>
                        <span className="text-sm text-white font-medium">{toolDef?.name ?? t._id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{t.count} uses</span>
                        <span className="text-xs text-brand-400">{t.credits}cr</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-accent rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        </StaggerItem>
      </StaggerList>
    </div>
  );
}
