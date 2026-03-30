"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cardReveal, sectionHeader, staggerSection, transitions, viewportOnce } from "@/lib/motion";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try OmniAITool with no commitment.",
    credits: 10,
    features: [
      "10 credits on signup",
      "Access to all text tools",
      "Basic history (last 10)",
      "Copy & export outputs",
    ],
    cta: "Get started free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for freelancers and small teams.",
    credits: 200,
    features: [
      "200 credits / month",
      "All text + SEO tools",
      "Full history access",
      "Priority generation",
      "Email support",
    ],
    cta: "Start Starter",
    href: "/register?plan=starter",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For power users and agencies.",
    credits: 1000,
    features: [
      "1,000 credits / month",
      "All tools incl. AI Media",
      "Unlimited history",
      "Image & voice generation",
      "Priority support",
      "API access (coming soon)",
    ],
    cta: "Go Pro",
    href: "/register?plan=pro",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
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
            💳 Simple Pricing
          </motion.div>
          <motion.h2 variants={sectionHeader} className="font-display text-4xl md:text-5xl font-700 text-white mb-4">
            Start free, scale as you grow
          </motion.h2>
          <motion.p variants={sectionHeader} className="text-slate-400 text-lg max-w-xl mx-auto">
            No hidden fees. Cancel anytime. Top up credits whenever you need more.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerSection}
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.name}
              variants={cardReveal}
              whileHover={plan.highlighted ? { scale: 1.02, transition: transitions.spring } : { y: -4, transition: transitions.spring }}
              className={`relative rounded-2xl p-7 flex flex-col transition-colors duration-200 ${
                plan.highlighted
                  ? "bg-brand-500/10 border-2 border-brand-500/50 shadow-glow-md"
                  : "glass-card hover:border-white/15"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold shadow-glow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="font-display font-700 text-white text-lg mb-1">{plan.name}</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className="font-display text-4xl font-800 text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                </div>
                <p className="text-slate-400 text-sm">{plan.description}</p>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 mb-6">
                <span className="text-lg">⚡</span>
                <span className="text-sm font-medium text-white">{plan.credits.toLocaleString()} credits</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-brand-400 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-brand-500 hover:bg-brand-400 text-white shadow-glow-sm hover:shadow-glow-md"
                    : "border border-surface-border text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-slate-500 text-sm mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ ...transitions.smooth, delay: 0.12 }}
        >
          Need more credits?{" "}
          <Link href="/pricing" className="text-brand-400 hover:text-brand-300 transition-colors">
            Buy credit bundles anytime →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
