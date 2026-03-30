import { connectDB } from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";
import AdminCreditsClient from "./AdminCreditsClient";
import { MotionInView } from "@/components/layout/MotionInView";

export default async function AdminCreditsPage() {
  let stats = { totalCreditsUsed: 0, totalCreditsInCirculation: 0, avgPerUser: 0 };
  let planBreakdown: any[] = [];

  try {
    await connectDB();
    const [creditAgg, users, planAgg] = await Promise.all([
      History.aggregate([{ $group: { _id: null, total: { $sum: "$creditsUsed" } } }]),
      User.find({}, "credits plan").lean(),
      User.aggregate([
        { $group: { _id: "$plan", count: { $sum: 1 }, totalCredits: { $sum: "$credits" } } },
        { $sort: { count: -1 } },
      ]),
    ]);
    stats.totalCreditsUsed         = creditAgg[0]?.total ?? 0;
    stats.totalCreditsInCirculation = users.reduce((acc: number, u: any) => acc + (u.credits ?? 0), 0);
    stats.avgPerUser                = users.length ? Math.round(stats.totalCreditsInCirculation / users.length) : 0;
    planBreakdown                   = JSON.parse(JSON.stringify(planAgg));
  } catch (_) {}

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <MotionInView className="mb-8">
        <h1 className="font-display text-3xl font-700 text-white mb-1">Credits Overview</h1>
        <p className="text-slate-400 text-sm">Monitor and manage credit usage across the platform</p>
      </MotionInView>
      <AdminCreditsClient stats={stats} planBreakdown={planBreakdown} />
    </div>
  );
}
