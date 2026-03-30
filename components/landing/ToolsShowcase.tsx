"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/lib/tools-data";
import { cardGrid, cardReveal, sectionHeader, staggerSection, transitions, viewportOnce } from "@/lib/motion";

const FEATURED_CATEGORIES: ToolCategory[] = [
  "writing",
  "seo",
  "social",
  "productivity",
  "marketing",
  "advanced",
  "media",
];

export default function ToolsShowcase() {
  return (
    <section id="tools" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
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
            🛠️ Tool Library
          </motion.div>
          <motion.h2 variants={sectionHeader} className="font-display text-4xl md:text-5xl font-700 text-white mb-4">
            Every tool you&apos;ll ever need
          </motion.h2>
          <motion.p variants={sectionHeader} className="text-slate-400 text-lg max-w-xl mx-auto">
            40+ purpose-built AI tools organized by category. Jump in and start creating.
          </motion.p>
        </motion.div>

        {FEATURED_CATEGORIES.map((cat) => {
          const tools = TOOLS.filter((t) => t.category === cat).slice(0, 4);
          const catInfo = CATEGORIES[cat];
          return (
            <motion.div
              key={cat}
              className="mb-14"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerSection}
            >
              <motion.div variants={cardReveal} className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${catInfo.color} ${catInfo.bg}`}>
                    {catInfo.label}
                  </span>
                  <span className="text-slate-500 text-sm">
                    {TOOLS.filter((t) => t.category === cat).length} tools
                  </span>
                </div>
                <Link
                  href={`/tools?category=${cat}`}
                  className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
                >
                  View all →
                </Link>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                variants={cardGrid}
              >
                {tools.map((tool) => (
                  <motion.div key={tool.slug} variants={cardReveal}>
                    <Link
                      href={`/tools/${tool.slug}`}
                      className="group block glass-card rounded-xl p-5 h-full hover:border-brand-500/30 hover:bg-brand-500/5 transition-colors duration-200"
                    >
                      <motion.div
                        className="h-full"
                        whileHover={{ y: -3, transition: transitions.spring }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{tool.icon}</span>
                          <div className="flex items-center gap-1">
                            {tool.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300">
                                {tool.badge}
                              </span>
                            )}
                            <span className="text-xs text-slate-500">{tool.credits}cr</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-sm text-white mb-1 group-hover:text-brand-300 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{tool.description}</p>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          );
        })}

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={transitions.smooth}
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-surface-card border border-surface-border text-slate-300 hover:text-white hover:border-white/20 font-medium transition-all hover:bg-white/5"
          >
            View all 40+ tools →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
