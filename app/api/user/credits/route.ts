import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// GET — return current credit balance
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById((session.user as any).id).select("credits plan").lean() as any;
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ credits: user.credits, plan: user.plan });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
