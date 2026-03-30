import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({
      email:              email.toLowerCase(),
      resetToken:         token,
      resetTokenExpires:  { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    user.password                   = password;
    (user as any).resetToken        = undefined;
    (user as any).resetTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
