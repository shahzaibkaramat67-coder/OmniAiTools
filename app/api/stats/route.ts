// Place at: app/api/stats/route.ts  (NEW public stats API — no auth needed)
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";
import { TOOLS } from "@/lib/tools-data";

// In-memory cache — avoids DB hit on every page load
let cache: { data: any; cachedAt: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M+`;
  if (n >= 1_000)     return `${Math.floor(n / 1_000)}K+`;
  return `${n}+`;
}

export async function GET() {
  try {
    // Return cache if still fresh
    if (cache && Date.now() - cache.cachedAt < CACHE_TTL) {
      return NextResponse.json(cache.data);
    }

    await connectDB();

    const [totalUsers, totalGenerations] = await Promise.all([
      User.countDocuments(),
      History.countDocuments(),
    ]);

    const data = {
      tools:       `${TOOLS.length}+`,
      users:       formatCount(totalUsers),
      generations: formatCount(totalGenerations),
      uptime:      "99.9%",
    };

    cache = { data, cachedAt: Date.now() };

    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });

  } catch (err: any) {
    console.error("[stats]", err.message);
    // Fallback if DB is down
    return NextResponse.json({
      tools: `${TOOLS.length}+`, users: "10K+", generations: "1M+", uptime: "99.9%",
    });
  }
}
