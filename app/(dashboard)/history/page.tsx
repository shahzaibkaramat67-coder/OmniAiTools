import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import History from "@/models/History";
import mongoose from "mongoose";
import HistoryClient from "./HistoryClient";
import { MotionInView } from "@/components/layout/MotionInView";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  const user    = session?.user as any;

  let history: any[]    = [];
  let total             = 0;
  let totalCreditsUsed  = 0;

  try {
    await connectDB();

    const userId = new mongoose.Types.ObjectId(user?.id);

    const [raw, count, agg] = await Promise.all([
      History.find({ userId }).sort({ createdAt: -1 }).limit(100).lean(),
      History.countDocuments({ userId }),
      History.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: "$creditsUsed" } } },
      ]),
    ]);

    history          = JSON.parse(JSON.stringify(raw));
    total            = count;
    totalCreditsUsed = agg[0]?.total ?? 0;
  } catch (_) {}

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <MotionInView className="mb-8">
        <h1 className="font-display text-3xl font-700 text-white mb-2">History</h1>
        <p className="text-slate-400 text-sm">All your AI-generated content, saved automatically</p>
      </MotionInView>

      {/* Stats row */}
      <StaggerList className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total generations", value: total,            icon: "⚡" },
          { label: "Credits used",      value: totalCreditsUsed, icon: "🪙" },
          { label: "Saved outputs",     value: history.length,   icon: "📄" },
        ].map((s) => (
          <StaggerItem key={s.label}>
            <div className="glass-card rounded-xl p-5 text-center h-full">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-display text-2xl font-700 text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerList>

      <HistoryClient history={history} />
    </div>
  );
}
