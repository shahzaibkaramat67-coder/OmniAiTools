"use client";
// Place at: app/(admin)/admin/blog/page.tsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";

interface Post {
  _id:       string;
  title:     string;
  slug:      string;
  category:  string;
  published: boolean;
  featured:  boolean;
  views:     number;
  readTime:  string;
  author:    string;
  createdAt: string;
}

const CATEGORIES = ["Tutorials","AI Tips","Updates","Productivity","SEO","Marketing","Business","Coding"];
const EMPTY_FORM = { title:"", excerpt:"", content:"", category:"Tutorials", tags:"", readTime:"5 min", featured:false, published:false };

export default function AdminBlogPage() {
  const [posts,   setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing,  setEditing]  = useState<Post | null>(null);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch { toast.error("Failed to load posts"); }
    finally { setLoading(false); }
  };

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setForm({ ...EMPTY_FORM, ...post, tags: (post as any).tags?.join(", ") ?? "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title.trim())   { toast.error("Title is required");   return; }
    if (!form.excerpt.trim()) { toast.error("Excerpt is required"); return; }
    if (!form.content.trim()) { toast.error("Content is required"); return; }
    setSaving(true);
    try {
      const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) };
      const res = editing
        ? await fetch("/api/admin/blog", { method: "PATCH", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ id: editing._id, ...payload }) })
        : await fetch("/api/admin/blog", { method: "POST",  headers: { "Content-Type":"application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(editing ? "Post updated!" : "Post created!");
      setShowForm(false);
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(id);
    try {
      await fetch("/api/admin/blog", { method: "DELETE", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ id }) });
      toast.success("Post deleted");
      fetchPosts();
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(null); }
  };

  const togglePublish = async (post: Post) => {
    try {
      await fetch("/api/admin/blog", { method: "PATCH", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ id: post._id, published: !post.published }) });
      toast.success(post.published ? "Post unpublished" : "Post published!");
      fetchPosts();
    } catch { toast.error("Failed to update"); }
  };

  const inputCls = "w-full px-4 py-2.5 rounded-xl bg-surface border border-surface-border text-white placeholder-slate-600 text-sm focus:outline-none focus:border-brand-500/60 transition-all";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-700 text-white">Blog Management</h1>
          <p className="text-slate-400 text-sm mt-1">Only you (admin) can create, edit, and publish posts</p>
        </div>
        <button onClick={openNew}
          className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm">
          + New Post
        </button>
      </div>

      {/* Posts Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card rounded-xl p-4 animate-pulse"><div className="shimmer h-5 w-1/2 rounded" /></div>)}
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4 opacity-30">✍️</div>
          <p className="text-white font-semibold mb-2">No posts yet</p>
          <p className="text-slate-400 text-sm mb-5">Create your first blog post to get started.</p>
          <button onClick={openNew} className="px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-all">
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post._id} className="glass-card rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-surface-hover border border-surface-border text-slate-400">{post.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${post.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                  {post.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-semibold">⭐ Featured</span>}
                </div>
                <p className="text-sm font-semibold text-white truncate">{post.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{post.author} · {post.readTime} read · {post.views} views · {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(post)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${post.published ? "border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10" : "border border-green-500/30 text-green-400 hover:bg-green-500/10"}`}>
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => openEdit(post)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-surface-border text-slate-400 hover:text-white hover:border-white/20 transition-all">
                  Edit
                </button>
                <button onClick={() => handleDelete(post._id)} disabled={deleting === post._id}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50">
                  {deleting === post._id ? "…" : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="glass-card rounded-2xl w-full max-w-2xl my-8 p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-700 text-white">{editing ? "Edit Post" : "New Blog Post"}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white text-2xl transition-colors">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Title <span className="text-red-400">*</span></label>
                <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="How to Use AI for Blog Writing" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Excerpt <span className="text-red-400">*</span></label>
                <textarea value={form.excerpt} onChange={e => setForm(p => ({...p, excerpt: e.target.value}))} placeholder="Brief description shown on the blog listing page…" rows={2} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Full Content <span className="text-red-400">*</span></label>
                <textarea value={form.content} onChange={e => setForm(p => ({...p, content: e.target.value}))} placeholder="Write your full article here…" rows={10} className={`${inputCls} resize-none font-mono text-xs`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Read Time</label>
                  <input value={form.readTime} onChange={e => setForm(p => ({...p, readTime: e.target.value}))} placeholder="5 min" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Tags (comma separated)</label>
                <input value={form.tags} onChange={e => setForm(p => ({...p, tags: e.target.value}))} placeholder="AI, writing, productivity" className={inputCls} />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({...p, featured: e.target.checked}))} className="w-4 h-4 accent-brand-500" />
                  <span className="text-sm text-slate-300">⭐ Featured post</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.published} onChange={e => setForm(p => ({...p, published: e.target.checked}))} className="w-4 h-4 accent-brand-500" />
                  <span className="text-sm text-slate-300">🌐 Publish now</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-surface-border">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-surface-border text-slate-400 hover:text-white text-sm transition-all">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm disabled:opacity-60">
                {saving ? "Saving…" : editing ? "Save Changes" : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
