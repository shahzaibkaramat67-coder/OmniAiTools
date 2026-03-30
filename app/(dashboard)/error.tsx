"use client";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
      >
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="font-display text-2xl font-700 text-white mb-3">Something went wrong</h2>
        <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
          {error.message || "An unexpected error occurred loading this page."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all"
          >
            Go to dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
