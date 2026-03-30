import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { current, next } = await req.json();
    if (!current || !next) return NextResponse.json({ error: "Both passwords required" }, { status: 400 });
    if (next.length < 8)   return NextResponse.json({ error: "Password too short" }, { status: 400 });

    await connectDB();
    const user = await User.findById((session.user as any).id).select("+password");
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const valid = await user.comparePassword(current);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

    user.password = next;
    await user.save();

    return NextResponse.json({ message: "Password updated" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
