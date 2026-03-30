import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const now        = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days  = new Date(now.getTime() -  7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersLast30,
      newUsersLast7,
      totalGenerations,
      generationsLast30,
      creditAgg,
      planBreakdown,
      topTools,
      dailyGenerations,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: last30Days } }),
      User.countDocuments({ createdAt: { $gte: last7Days  } }),
      History.countDocuments(),
      History.countDocuments({ createdAt: { $gte: last30Days } }),
      History.aggregate([{ $group: { _id: null, total: { $sum: "$creditsUsed" } } }]),
      User.aggregate([
        { $group: { _id: "$plan", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      History.aggregate([
        { $group: { _id: "$toolSlug", count: { $sum: 1 }, credits: { $sum: "$creditsUsed" } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      History.aggregate([
        { $match: { createdAt: { $gte: last30Days } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return NextResponse.json({
      users: {
        total:     totalUsers,
        last30Days: newUsersLast30,
        last7Days:  newUsersLast7,
      },
      generations: {
        total:     totalGenerations,
        last30Days: generationsLast30,
      },
      creditsUsed:       creditAgg[0]?.total ?? 0,
      planBreakdown,
      topTools,
      dailyGenerations,
    });

  } catch (err) {
    console.error("[admin/stats]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
