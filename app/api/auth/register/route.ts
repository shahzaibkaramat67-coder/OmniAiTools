import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (name.trim().length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const user = await User.create({
      name:          name.trim(),
      email:         email.toLowerCase().trim(),
      password,
      credits:       10,
      plan:          "free",
      emailVerified: true,
    });

    // Send welcome email (non-blocking — don't fail registration if email fails)
    sendWelcomeEmail(user.email, user.name).catch((err) =>
      console.error("[register] welcome email failed:", err)
    );

    return NextResponse.json({
      message: "Account created successfully",
      user:    { id: user._id.toString(), name: user.name, email: user.email },
    }, { status: 201 });

  } catch (error: any) {
    console.error("[register] error:", error);
    if (error?.code === 11000) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
