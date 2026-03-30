"use client";
// Place at: app/blog/page.tsx  — fully dynamic with working category filter
import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { MotionInView } from "@/components/layout/MotionInView";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";
import { transitions } from "@/lib/motion";

interface Post {
  _id:       string;
  title:     string;
  slug:      string;
  excerpt:   string;
  category:  string;
  author:    string;
  readTime:  string;
  featured:  boolean;
  createdAt: string;
  tags:      string[];
}

const AVATAR_BG: Record<string, string> = {
  default: "bg-brand-500/30",
};
const CAT_CLR: Record<string, string> = {
  Tutorials:    "bg-blue-400/10 text-blue-400",
  "AI Tips":    "bg-purple-400/10 text-purple-400",
  Updates:      "bg-green-400/10 text-green-400",
  Productivity: "bg-yellow-400/10 text-yellow-400",
  SEO:          "bg-orange-400/10 text-orange-400",
  Marketing:    "bg-pink-400/10 text-pink-400",
  Business:     "bg-cyan-400/10 text-cyan-400",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function BlogPage() {
  const [posts,      setPosts]      = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activecat,  setActivecat]  = useState("All");
  const [loading,    setLoading]    = useState(true);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search,     setSearch]     = useState("");

  // Fetch posts whenever category or page changes
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activecat !== "All") params.set("category", activecat);
        params.set("page", String(page));
        const res  = await fetch(`/api/blog?${params}`);
        const data = await res.json();
        setPosts(data.posts ?? []);
        setTotalPages(data.pages ?? 1);
        // Build category list from API on first load
        if (data.categories?.length) {
          setCategories(data.categories);
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchPosts();
  }, [activecat, page]);

  // Reset to page 1 when category changes
  const handleCat = (cat: string) => {
    setActivecat(cat);
    setPage(1);
  };

  const featured = posts.filter((p) => p.featured);
  const regular  = posts.filter((p) => !p.featured);

  // Client-side search filter on top of server results
  const searchedRegular = search
    ? regular.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      )
    : regular;

  const allCats = ["All", ...categories];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <MotionInView className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface-card text-slate-400 text-sm mb-6">
              ✍️ OmniAITool Blog
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-800 text-white mb-4">
              AI tips, tutorials &amp; updates
            </h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Learn how to get the most out of AI tools — written by your admin team.
            </p>
          </MotionInView>

          {/* Search bar */}
          <MotionInView className="flex justify-center mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full max-w-md px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
            />
          </MotionInView>

          {/* Dynamic category tabs — loaded from DB */}
          <MotionInView className="flex items-center gap-2 flex-wrap justify-center mb-12">
            {allCats.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCat(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activecat === cat
                    ? "bg-brand-500 text-white shadow-glow-sm"
                    : "bg-surface-card border border-surface-border text-slate-400 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </MotionInView>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-surface-hover" />
                  <div className="p-5 space-y-3">
                    <div className="shimmer h-3 w-20 rounded" />
                    <div className="shimmer h-5 w-full rounded" />
                    <div className="shimmer h-4 w-3/4 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && posts.length === 0 && (
            <div className="glass-card rounded-2xl p-16 text-center mb-10">
              <div className="text-5xl mb-4 opacity-30">✍️</div>
              <p className="text-white font-semibold mb-2">No posts yet</p>
              <p className="text-slate-500 text-sm">
                {activecat !== "All"
                  ? `No posts in "${activecat}" yet. Try a different category.`
                  : "The admin hasn't published any posts yet. Check back soon!"}
              </p>
            </div>
          )}

          {/* Featured posts */}
          {!loading && featured.length > 0 && (
            <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {featured.map((post) => (
                <StaggerItem key={post._id}>
                <motion.div whileHover={{ y: -3, transition: transitions.spring }} className="h-full">
                <Link href={`/blog/${post.slug}`}
                  className="group glass-card rounded-2xl overflow-hidden hover:border-brand-500/25 transition-colors duration-200 block h-full">
                  <div className="h-48 bg-gradient-to-br from-brand-500/20 to-accent/15 flex items-center justify-center border-b border-surface-border relative">
                    <span className="text-5xl opacity-40">✍️</span>
                    <span className="absolute top-3 left-3 text-[10px] px-2 py-0.5 rounded-full bg-brand-500 text-white font-bold">
                      Featured
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${CAT_CLR[post.category] ?? "bg-slate-500/20 text-slate-400"}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-600">{post.readTime} read</span>
                    </div>
                    <h2 className="font-display font-700 text-white text-xl mb-2 group-hover:text-brand-300 transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand-500/30 flex items-center justify-center text-xs font-bold text-white">
                        {getInitials(post.author)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{post.author}</p>
                        <p className="text-[10px] text-slate-500">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
                </motion.div>
                </StaggerItem>
              ))}
            </StaggerList>
          )}

          {/* Regular posts */}
          {!loading && searchedRegular.length > 0 && (
            <StaggerList className="space-y-4 mb-10">
              {searchedRegular.map((post) => (
                <StaggerItem key={post._id}>
                <motion.div whileHover={{ y: -2, transition: transitions.spring }}>
                <Link href={`/blog/${post.slug}`}
                  className="group glass-card rounded-2xl p-6 flex flex-col sm:flex-row gap-5 hover:border-brand-500/25 transition-colors duration-200">
                  <div className="w-full sm:w-36 h-28 rounded-xl bg-gradient-to-br from-brand-500/15 to-accent/10 flex items-center justify-center border border-surface-border flex-shrink-0">
                    <span className="text-3xl opacity-40">✍️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${CAT_CLR[post.category] ?? "bg-slate-500/20 text-slate-400"}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-slate-600">{post.readTime} read · {formatDate(post.createdAt)}</span>
                    </div>
                    <h2 className="font-display font-600 text-white text-lg mb-1.5 group-hover:text-brand-300 transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-500/30 flex items-center justify-center text-[10px] font-bold text-white">
                        {getInitials(post.author)}
                      </div>
                      <span className="text-xs text-slate-500">{post.author}</span>
                    </div>
                  </div>
                </Link>
                </motion.div>
                </StaggerItem>
              ))}
            </StaggerList>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-surface-border text-slate-400 hover:text-white hover:border-white/20 text-sm transition-all disabled:opacity-40">
                ← Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    page === i + 1
                      ? "bg-brand-500 text-white shadow-glow-sm"
                      : "border border-surface-border text-slate-400 hover:text-white hover:border-white/20"
                  }`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 rounded-xl border border-surface-border text-slate-400 hover:text-white hover:border-white/20 text-sm transition-all disabled:opacity-40">
                Next →
              </button>
            </div>
          )}

          {/* Newsletter CTA */}
          <MotionInView className="glass-card rounded-2xl p-10 text-center border-brand-500/15">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="font-display text-2xl font-700 text-white mb-3">Get AI tips in your inbox</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              Weekly tips on using AI tools to work faster and smarter. No spam, ever.
            </p>
            <div className="flex gap-3 max-w-sm mx-auto">
              <input type="email" placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-xl bg-surface-card border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all" />
              <button className="px-5 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm flex-shrink-0">
                Subscribe
              </button>
            </div>
          </MotionInView>

        </div>
      </main>
      <Footer />
    </div>
  );
}
