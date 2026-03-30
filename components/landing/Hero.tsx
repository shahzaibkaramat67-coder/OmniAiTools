"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  chipItem,
  chipsContainer,
  heroContainer,
  heroItem,
  statsContainer,
  statsItem,
  transitions,
} from "@/lib/motion";

interface HeroStats {
  tools: number;
  users: string;
  generations: string;
}

export default function Hero({ stats }: { stats: HeroStats }) {
  const STATS = [
    { value: `${stats.tools}+`, label: "AI Tools" },
    { value: stats.users, label: "Users" },
    { value: stats.generations, label: "Generations" },
    { value: "99.9%", label: "Uptime" },
  ];

  const chipNames = [
    "Blog Generator",
    "SEO Title",
    "Image Generator",
    "Twitter Thread",
    "Email Writer",
    "Code Explainer",
    "Ad Copy",
    "Hook Generator",
    "Resume",
    "TTS",
    "Cover Letter",
    "Keyword Research",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/10 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.06, 1], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/8 rounded-full blur-[100px]"
          animate={{ scale: [1, 1.12, 1], x: [0, 12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-400/6 rounded-full blur-[80px]"
          animate={{ scale: [1, 1.08, 1], y: [0, -16, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        initial="hidden"
        animate="visible"
        variants={heroContainer}
      >
        <motion.div
          variants={heroItem}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-slow" />
          {stats.tools}+ AI-Powered Tools — One Platform
        </motion.div>

        <motion.h1
          variants={heroItem}
          className="font-display text-5xl md:text-7xl font-800 leading-[1.05] tracking-tight text-white mb-6"
        >
          Create anything with
          <br />
          <span className="gradient-text">AI superpowers</span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Generate content, optimize for SEO, create AI media, and automate your workflow — all in one powerful
          platform. No prompt engineering needed.
        </motion.p>

        <motion.div
          variants={heroItem}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={transitions.spring}>
            <Link
              href="/register"
              className="group inline-flex px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-base transition-colors shadow-glow-md hover:shadow-glow-lg"
            >
              Start free — 50 credits
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} transition={transitions.spring}>
            <Link
              href="#tools"
              className="inline-block px-8 py-3.5 rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-white/20 font-medium text-base transition-all hover:bg-white/5"
            >
              Browse all tools
            </Link>
          </motion.div>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto" variants={statsContainer}>
          {STATS.map((stat) => (
            <motion.div key={stat.label} variants={statsItem} className="text-center">
              <div className="font-display text-3xl font-800 gradient-text">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mt-16 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto" variants={chipsContainer}>
          {chipNames.map((name) => (
            <motion.span
              key={name}
              variants={chipItem}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-surface-card border border-surface-border text-slate-400"
            >
              {name}
            </motion.span>
          ))}
          <motion.span
            variants={chipItem}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand-500/20 border border-brand-500/30 text-brand-300"
          >
            +{Math.max(0, stats.tools - 12)} more
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}
