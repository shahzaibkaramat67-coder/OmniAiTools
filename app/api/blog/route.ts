// Place at: app/api/blog/route.ts
// Public API — returns published posts, supports category filter
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "All";
  const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit    = 12;

  try {
    await connectDB();

    const query: any = { published: true };
    if (category && category !== "All") query.category = category;

    const [posts, total, categories] = await Promise.all([
      BlogPost.find(query)
        .select("title slug excerpt category author readTime featured createdAt tags")
        .sort({ featured: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(query),
      // get all unique categories from published posts
      BlogPost.distinct("category", { published: true }),
    ]);

    return NextResponse.json({ posts, total, categories, page, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    console.error("[blog api]", err.message);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
