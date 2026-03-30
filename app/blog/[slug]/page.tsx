// Place at: app/blog/[slug]/page.tsx
// Fetches post from MongoDB — not hardcoded
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { MotionInView } from "@/components/layout/MotionInView";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const CAT_COLOR: Record<string, string> = {
  Tutorials:    "bg-blue-400/10 text-blue-400",
  "AI Tips":    "bg-purple-400/10 text-purple-400",
  Updates:      "bg-green-400/10 text-green-400",
  Productivity: "bg-yellow-400/10 text-yellow-400",
  SEO:          "bg-orange-400/10 text-orange-400",
  Marketing:    "bg-pink-400/10 text-pink-400",
  Business:     "bg-cyan-400/10 text-cyan-400",
  Coding:       "bg-rose-400/10 text-rose-400",
};

// ── Dynamic metadata from DB ─────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug: params.slug, published: true })
      .select("title excerpt author createdAt")
      .lean() as any;

    if (!post) return { title: "Post Not Found | OmniAITool Blog" };

    return {
      title:       `${post.title} | OmniAITool Blog`,
      description: post.excerpt,
      openGraph: {
        title:         post.title,
        description:   post.excerpt,
        type:          "article",
        publishedTime: post.createdAt,
        authors:       [post.author],
      },
      twitter: {
        card:        "summary_large_image",
        title:       post.title,
        description: post.excerpt,
      },
    };
  } catch {
    return { title: "OmniAITool Blog" };
  }
}

// ── Server component — fetches from DB ───────────────────────
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  await connectDB();

  // Fetch + increment view count
  const post = await BlogPost.findOneAndUpdate(
    { slug: params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  ).lean() as any;

  if (!post) notFound();

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  // Split content into paragraphs for rendering
  const paragraphs = (post.content as string)
    .split(/\n{2,}/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <MotionInView className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/"     className="hover:text-white transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-slate-300 truncate max-w-[200px]" aria-current="page">
              {post.title}
            </span>
          </nav>

          {/* Category + meta */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              CAT_COLOR[post.category] ?? "bg-slate-500/20 text-slate-400"
            }`}>
              {post.category}
            </span>
            <span className="text-sm text-slate-500">{post.readTime} read</span>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <span className="text-sm text-slate-500">{formattedDate}</span>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <span className="text-sm text-slate-500">{post.views} views</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl font-800 text-white leading-tight mb-6">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 pb-8 mb-8 border-b border-surface-border">
            <div className="w-10 h-10 rounded-full bg-brand-500/30 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
              {post.author.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author}</p>
              <p className="text-xs text-slate-500">OmniAITool Team</p>
            </div>
          </div>

          {/* Hero banner */}
          <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent/15 flex items-center justify-center border border-surface-border mb-10">
            <span className="text-6xl opacity-30" aria-hidden="true">✍️</span>
          </div>

          {/* Excerpt */}
          <p className="text-slate-300 text-lg leading-relaxed mb-10 italic border-l-2 border-brand-500 pl-4">
            {post.excerpt}
          </p>

          {/* Full article content */}
          <article className="space-y-5">
            {paragraphs.map((para: string, i: number) => {
              // Heading detection — lines starting with ## or #
              if (para.startsWith("## ")) {
                return (
                  <h2 key={i} className="font-display text-2xl font-700 text-white mt-8 mb-3">
                    {para.slice(3)}
                  </h2>
                );
              }
              if (para.startsWith("# ")) {
                return (
                  <h2 key={i} className="font-display text-3xl font-700 text-white mt-10 mb-4">
                    {para.slice(2)}
                  </h2>
                );
              }
              // Bullet list detection
              if (para.startsWith("- ")) {
                const items = para.split("\n").filter((l: string) => l.startsWith("- "));
                return (
                  <ul key={i} className="space-y-2 ml-4">
                    {items.map((item: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-slate-400 text-base leading-relaxed">
                        <span className="text-brand-400 mt-1 flex-shrink-0">•</span>
                        {item.slice(2)}
                      </li>
                    ))}
                  </ul>
                );
              }
              // Normal paragraph
              return (
                <p key={i} className="text-slate-400 text-base leading-relaxed">
                  {para}
                </p>
              );
            })}
          </article>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-10 pt-8 border-t border-surface-border">
              <span className="text-sm text-slate-500">Tags:</span>
              {post.tags.map((tag: string) => (
                <span key={tag}
                  className="px-3 py-1 rounded-full bg-surface-card border border-surface-border text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-default">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 glass-card rounded-2xl p-8 text-center border-brand-500/15">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-display text-xl font-700 text-white mb-2">
              Try OmniAITool for free
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              50 free credits on signup — no credit card needed.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/register"
                className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm hover:shadow-glow-md">
                Get started free →
              </Link>
              <Link href="/tools"
                className="px-6 py-3 rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all hover:bg-white/5">
                Browse all tools
              </Link>
            </div>
          </div>

          {/* Back */}
          <div className="mt-10 text-center">
            <Link href="/blog"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to all articles
            </Link>
          </div>

        </MotionInView>
      </main>
      <Footer />
    </div>
  );
}
