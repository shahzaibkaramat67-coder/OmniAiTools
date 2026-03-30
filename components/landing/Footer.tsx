"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeIn, sectionHeader, staggerSection, viewportOnce } from "@/lib/motion";

const toolLinks: [string, string][] = [
  ["All Tools", "/tools"],
  ["Writing", "/tools?category=writing"],
  ["SEO", "/tools?category=seo"],
  ["Social Media", "/tools?category=social"],
  ["Marketing", "/tools?category=marketing"],
  ["AI Media", "/tools?category=media"],
];

const productLinks: [string, string][] = [
  ["Pricing", "/pricing"],
  ["Blog", "/blog"],
  ["Dashboard", "/dashboard"],
  ["History", "/history"],
  ["Settings", "/settings"],
];

const companyLinks: [string, string][] = [
  ["About", "/about"],
  ["Blog", "/blog"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
];

export default function Footer() {
  return (
    <footer className="border-t border-surface-border py-14 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerSection}
        >
          <motion.div variants={fadeIn} className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center text-sm font-bold">
                O
              </div>
              <span className="font-display font-700 text-white">
                Omni<span className="gradient-text">AI</span>Tool
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5">
              50+ AI-powered tools for content creators, marketers, and developers. All in one place.
            </p>
            <div className="flex items-center gap-3">
              {[
                { label: "Twitter", href: "https://twitter.com/omniaitool", icon: "𝕏" },
                { label: "LinkedIn", href: "https://linkedin.com/company/omniaitool", icon: "in" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-surface-card border border-surface-border flex items-center justify-center text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={sectionHeader}>
            <h4 className="text-white font-semibold text-sm mb-4">Tools</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {toolLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={sectionHeader}>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {productLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={sectionHeader}>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              {companyLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-surface-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
        >
          <p className="text-slate-600 text-xs">© {new Date().getFullYear()} OmniAITool. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
              Terms
            </Link>
            <p className="text-slate-600 text-xs">Powered by GPT-4o · Built with Next.js</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
