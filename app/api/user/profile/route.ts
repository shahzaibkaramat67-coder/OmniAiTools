import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    await connectDB();
    await User.findByIdAndUpdate((session.user as any).id, { name: name.trim() });

    return NextResponse.json({ message: "Profile updated" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
