import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  try {
    const { userId, plan } = await req.json();
    if (!userId || !plan) return NextResponse.json({ error: "userId and plan required" }, { status: 400 });
    if (!["free", "starter", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    await connectDB();

    // Auto-assign credits on plan change
    const creditMap: Record<string, number> = { free: 10, starter: 200, pro: 1000 };
    await User.findByIdAndUpdate(userId, { plan, credits: creditMap[plan] });

    return NextResponse.json({ message: "Plan updated" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
