"use client";
import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getToolBySlug, CATEGORIES, TOOLS } from "@/lib/tools-data";
import { copyToClipboard } from "@/lib/utils";
import ToolCard from "@/components/dashboard/ToolCard";
import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";

export default function ToolPage() {
  const params  = useParams();
  const router  = useRouter();
  const { data: session, update } = useSession();
  const user    = session?.user as any;
  const tool    = getToolBySlug(params.slug as string);

  const [input,     setInput]     = useState("");
  const [output,    setOutput]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [copied,    setCopied]    = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  if (!tool) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-display text-xl font-700 text-white mb-2">Tool not found</h2>
        <p className="text-slate-400 text-sm mb-6">The tool does not exist.</p>
        <Link href="/tools" className="px-5 py-2.5 rounded-xl bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-all shadow-glow-sm">
          ← Browse tools
        </Link>
      </div>
    );
  }

  const catInfo      = CATEGORIES[tool.category];
  const relatedTools = TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 4);
  const wordCount    = output.split(/\s+/).filter(Boolean).length;

  const handleGenerate = async () => {
    if (!input.trim()) { toast.error("Please enter some input first"); return; }
    if (!session)       { toast.error("Please sign in"); router.push("/login"); return; }
    if ((user?.credits ?? 0) < tool.credits) {
      toast.error(`Not enough credits. Need ${tool.credits}, you have ${user?.credits ?? 0}`);
      return;
    }
    setLoading(true); setStreaming(true); setOutput("");
    abortRef.current = new AbortController();
    try {
      const res = await fetch("/api/generate/stream", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: tool.slug, input }),
        signal: abortRef.current.signal,
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n"); buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = JSON.parse(line.slice(6));
          if (json.error) throw new Error(json.error);
          if (json.text)  setOutput((prev) => prev + json.text);
          if (json.done) { await update(); toast.success(`Done! Used ${tool.credits} credits`); }
        }
      }
    } catch (err: any) {
      if (err.name !== "AbortError") toast.error(err.message || "Generation failed");
    } finally { setLoading(false); setStreaming(false); }
  };

  const handleStop  = () => { abortRef.current?.abort(); setLoading(false); setStreaming(false); };
  const handleCopy  = async () => { if (!output) return; await copyToClipboard(output); setCopied(true); toast.success("Copied!"); setTimeout(() => setCopied(false), 2000); };
  const handleClear = () => { setInput(""); setOutput(""); };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
        <span>/</span>
        <span className={catInfo.color}>{catInfo.label}</span>
        <span>/</span>
        <span className="text-slate-300 truncate">{tool.name}</span>
      </nav>
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-3xl flex-shrink-0 shadow-glow-sm">{tool.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="font-display text-2xl font-700 text-white">{tool.name}</h1>
            {tool.badge && <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-500/20 text-brand-300">{tool.badge}</span>}
            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${catInfo.color} ${catInfo.bg}`}>{catInfo.label}</span>
          </div>
          <p className="text-slate-400 text-sm mb-1">{tool.description}</p>
          <p className="text-xs text-slate-600">
            Costs <span className="text-brand-400 font-semibold">{tool.credits} credits</span> per generation
            {user && <> · You have <span className={`font-semibold ${(user.credits ?? 0) < tool.credits ? "text-red-400" : "text-white"}`}>{user.credits ?? 0}</span> credits</>}
          </p>
        </div>
      </div>

      {tool.isMedia && (
        <div className="glass-card rounded-xl p-4 mb-6 flex items-start gap-3 border-accent/20">
          <span className="text-accent text-lg flex-shrink-0">ℹ️</span>
          <p className="text-sm text-slate-400"><span className="text-white font-semibold">AI Media Tool — </span>Configure API keys in <Link href="/settings" className="text-brand-400 hover:text-brand-300 underline underline-offset-2">Settings</Link>.</p>
        </div>
      )}
      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        {/* Input */}
        <div className="glass-card rounded-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-surface-border">
            <label className="text-sm font-semibold text-slate-300">{tool.inputLabel}</label>
            <button onClick={handleClear} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Clear</button>
          </div>
          <div className="flex-1 p-5">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={tool.inputPlaceholder} rows={10} maxLength={5000}
              className="w-full h-full bg-transparent text-white placeholder-slate-600 text-sm resize-none focus:outline-none leading-relaxed" />
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-surface-border bg-surface-hover/50">
            <span className="text-xs text-slate-600">{input.length}/5000</span>
            <div className="flex items-center gap-2">
              {loading && (
                <button onClick={handleStop} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all">
                  <span className="w-2 h-2 rounded-sm bg-red-400 inline-block" /> Stop
                </button>
              )}
              <button onClick={handleGenerate} disabled={loading || !input.trim() || (user?.credits ?? 0) < tool.credits}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all shadow-glow-sm hover:shadow-glow-md disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (<><svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Generating…</>) : (<>⚡ Generate ({tool.credits}cr)</>)}
              </button>
            </div>
          </div>
        </div>
        {/* Output */}
        <div className="glass-card rounded-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-surface-border">
            <label className="text-sm font-semibold text-slate-300">Output</label>
            {output && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-600">{wordCount} words</span>
                <button onClick={() => { setOutput(""); handleGenerate(); }} disabled={loading} title="Regenerate" className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-surface-hover transition-all disabled:opacity-40">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                </button>
                <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-hover hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all">
                  {copied ? "✓ Copied!" : "📋 Copy"}
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 p-5 min-h-[260px] relative overflow-auto">
            {loading && !output && (<div className="space-y-3">{[...Array(7)].map((_,i)=><div key={i} className="shimmer rounded h-4" style={{width:`${55+(i*7)%45}%`,animationDelay:`${i*0.08}s`}}/>)}</div>)}
            {!loading && !output && (<div className="flex flex-col items-center justify-center h-full text-center py-8"><span className="text-5xl mb-3 opacity-20">{tool.icon}</span><p className="text-slate-600 text-sm">Output appears here as it generates</p><p className="text-slate-700 text-xs mt-1">Streams in real-time ⚡</p></div>)}
            {output && (<pre className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed font-sans">{output}{streaming && <span className="inline-block w-0.5 h-4 bg-brand-400 ml-0.5 animate-pulse align-text-bottom"/>}</pre>)}
          </div>
        </div>
      </div>
      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-600 text-white mb-4">More {catInfo.label} tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedTools.map((t) => <ToolCard key={t.slug} tool={t} variant="compact" />)}
          </div>
        </div>
      )}
    </div>
  );
}
