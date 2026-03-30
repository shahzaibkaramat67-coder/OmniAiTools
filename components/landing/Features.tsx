"use client";

import { motion } from "framer-motion";
import { cardReveal, sectionHeader, staggerSection, transitions, viewportOnce } from "@/lib/motion";

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Generation",
    description: "Powered by GPT-4o — get high-quality outputs in seconds, not minutes.",
  },
  {
    icon: "🎯",
    title: "Purpose-Built Prompts",
    description: "Each tool has a hand-crafted system prompt optimized for that exact use case.",
  },
  {
    icon: "💳",
    title: "Pay As You Go",
    description: "Credit-based system. Buy only what you need — no wasted subscriptions.",
  },
  {
    icon: "📜",
    title: "Full History",
    description: "Every generation is saved. Search, copy, and revisit your past outputs anytime.",
  },
  {
    icon: "🔒",
    title: "Secure & Private",
    description: "Your data is encrypted and never used to train AI models.",
  },
  {
    icon: "🧩",
    title: "40+ Tools & Growing",
    description: "New tools added regularly. Writing, SEO, Social, Media, and more.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerSection}
        >
          <motion.div
            variants={sectionHeader}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface-card text-slate-400 text-sm mb-6"
          >
            ✨ Why OmniAITool
          </motion.div>
          <motion.h2 variants={sectionHeader} className="font-display text-4xl md:text-5xl font-700 text-white mb-4">
            Built for creators who move fast
          </motion.h2>
          <motion.p variants={sectionHeader} className="text-slate-400 text-lg max-w-xl mx-auto">
            Everything designed to get you from idea to polished output in one click.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerSection}
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={cardReveal}
              whileHover={{ y: -4, transition: transitions.spring }}
              className="glass-card rounded-2xl p-6 hover:border-brand-500/20 transition-colors duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-2xl mb-4 group-hover:bg-brand-500/20 transition-colors">
                {f.icon}
              </div>
              <h3 className="font-display font-600 text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
