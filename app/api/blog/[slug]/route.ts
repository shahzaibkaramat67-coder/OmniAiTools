// Place at: app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    // Find published post AND increment view count atomically
    const post = await BlogPost.findOneAndUpdate(
      { slug: params.slug, published: true },
      { $inc: { views: 1 } },
      { new: true }
    ).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (err: any) {
    console.error("[blog slug api]", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
