"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { transitions } from "@/lib/motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center bg-surface relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-500/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transitions.smooth}
      >
        <p className="font-display text-8xl font-800 gradient-text mb-4">404</p>
        <h1 className="font-display text-2xl font-700 text-white mb-3">Page not found</h1>
        <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm"
          >
            Go home
          </Link>
          <Link
            href="/tools"
            className="px-6 py-2.5 rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all hover:bg-white/5"
          >
            Browse tools
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
