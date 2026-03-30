import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  const user = session.user as any;
  if (user?.role !== "admin") return null;
  return session;
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { userId, credits } = await req.json();
    if (!userId || credits === undefined) {
      return NextResponse.json({ error: "userId and credits required" }, { status: 400 });
    }
    await connectDB();
    await User.findByIdAndUpdate(userId, { credits: Number(credits) });
    return NextResponse.json({ message: "Credits updated" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
