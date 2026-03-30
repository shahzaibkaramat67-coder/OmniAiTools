import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import History from "@/models/History";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page     = parseInt(searchParams.get("page") ?? "1");
    const limit    = parseInt(searchParams.get("limit") ?? "20");
    const category = searchParams.get("category");
    const skip     = (page - 1) * limit;

    await connectDB();

    const query: any = { userId: (session.user as any).id };
    if (category) query.category = category;

    const [items, total] = await Promise.all([
      History.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      History.countDocuments(query),
    ]);

    return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await connectDB();
    await History.findOneAndDelete({ _id: id, userId: (session.user as any).id });

    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
