import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendPasswordReset } from "@/lib/email";
import crypto from "crypto";

const OK = NextResponse.json({ message: "If that email exists, a reset link was sent." });

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email?.trim()) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+resetToken +resetTokenExpires");

    if (!user) return OK; // prevent email enumeration

    const token   = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    (user as any).resetToken        = token;
    (user as any).resetTokenExpires = expires;
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    await sendPasswordReset(user.email, resetUrl);

    return OK;
  } catch (err) {
    console.error("[forgot-password] error:", err);
    return OK; // always return same response
  }
}
