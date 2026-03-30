// Place at: app/api/admin/blog/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import BlogPost from "@/models/BlogPost";

// helper — verify admin
async function verifyAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  await connectDB();
  const user = await User.findById((session.user as any).id).select("role");
  if (!user || user.role !== "admin") return null;
  return { userId: (session.user as any).id, name: (session.user as any).name };
}

// helper — generate slug from title
function makeSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// GET — list all posts (admin sees drafts too)
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await BlogPost.find()
    .sort({ createdAt: -1 })
    .select("title slug category published featured views createdAt readTime author")
    .lean();

  return NextResponse.json({ posts });
}

// POST — create new post
export async function POST(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, excerpt, content, category, tags, readTime, featured, published } = body;

  if (!title?.trim())   return NextResponse.json({ error: "Title is required" },   { status: 400 });
  if (!excerpt?.trim()) return NextResponse.json({ error: "Excerpt is required" }, { status: 400 });
  if (!content?.trim()) return NextResponse.json({ error: "Content is required" }, { status: 400 });
  if (!category?.trim()) return NextResponse.json({ error: "Category is required" }, { status: 400 });

  let slug = makeSlug(title);
  // ensure unique slug
  const existing = await BlogPost.exists({ slug });
  if (existing) slug = `${slug}-${Date.now()}`;

  const post = await BlogPost.create({
    title: title.trim(),
    slug,
    excerpt: excerpt.trim(),
    content: content.trim(),
    category: category.trim(),
    tags:     Array.isArray(tags) ? tags : [],
    author:   admin.name,
    authorId: admin.userId,
    readTime: readTime ?? "5 min",
    featured: featured ?? false,
    published: published ?? false,
  });

  return NextResponse.json({ post }, { status: 201 });
}

// PATCH — update a post
export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...updates } = await req.json();
  if (!id) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

  // Regenerate slug if title changed
  if (updates.title) updates.slug = makeSlug(updates.title);

  const post = await BlogPost.findByIdAndUpdate(id, updates, { new: true });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  return NextResponse.json({ post });
}

// DELETE — delete a post
export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

  await BlogPost.findByIdAndDelete(id);
  return NextResponse.json({ message: "Post deleted" });
}
