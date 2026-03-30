import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";
import { TOOLS } from "@/lib/tools-data";
import { MotionInView } from "@/components/layout/MotionInView";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";

export const metadata: Metadata = {
  title: "About OmniAITool — Our Story, Mission & Team",
  description: "Learn about OmniAITool — the all-in-one AI platform built for creators, marketers, and developers.",
};

// Revalidate every hour — fresh stats without hitting DB on every visit
export const revalidate = 3600;

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M+`;
  if (n >= 1_000)     return `${Math.floor(n / 1_000)}K+`;
  return n > 0 ? `${n}+` : "0";
}

const TEAM = [
  { name: "Alex Chen",     role: "CEO & Co-Founder",  avatar: "AC", bg: "bg-brand-500/30",  bio: "10 years in AI & SaaS. Ex-Google."   },
  { name: "Sara Mills",    role: "CTO & Co-Founder",  avatar: "SM", bg: "bg-violet-500/30", bio: "ML Engineer. Stanford CS grad."      },
  { name: "James Park",    role: "Head of Product",   avatar: "JP", bg: "bg-green-500/30",  bio: "Built 3 products to 100K+ users."    },
  { name: "Layla Hassan",  role: "Head of Growth",    avatar: "LH", bg: "bg-orange-500/30", bio: "Growth hacker. 5x startup veteran."  },
  { name: "Omar Siddiqui", role: "Lead Engineer",     avatar: "OS", bg: "bg-purple-500/30", bio: "Full-stack. Next.js & AI specialist." },
  { name: "Mia Tanaka",    role: "Head of Design",    avatar: "MT", bg: "bg-pink-500/30",   bio: "Ex-Figma. Design systems expert."    },
];

const TIMELINE = [
  { year: "2024 Q1", event: "OmniAITool founded with 10 core tools",          icon: "🚀" },
  { year: "2024 Q2", event: "Reached 1,000 registered users",                 icon: "🎯" },
  { year: "2024 Q3", event: "Launched AI Media tools — image, voice & video", icon: "🎨" },
  { year: "2024 Q4", event: "Crossed 10,000 users & 1M+ generations",         icon: "🏆" },
  { year: "2025 Q1", event: "50+ tools, global expansion, Paddle payments",   icon: "🌍" },
  { year: "2025 Q2", event: "Enterprise plan launched, API access opened",     icon: "⚡" },
];

const VALUES = [
  { icon: "⚡", title: "Speed First",        desc: "Every tool is optimized for fast, high-quality output. We obsess over milliseconds so you can focus on ideas."  },
  { icon: "🔒", title: "Privacy by Default", desc: "Your data is yours. We never train AI models on your content and never sell your information."                  },
  { icon: "💡", title: "Always Improving",   desc: "New tools ship every month. We listen to users and build exactly what they need."                               },
  { icon: "🌍", title: "Built for Everyone", desc: "From a student in Karachi to a marketer in New York — OmniAITool works for everyone, everywhere."               },
  { icon: "💰", title: "Fair Pricing",       desc: "Start free. Pay only for what you use. No bloated subscriptions for tools you never touch."                    },
  { icon: "🤝", title: "Transparent",        desc: "Clear pricing, honest limits, no dark patterns. We treat our users the way we want to be treated."             },
];

// Fetch real stats from DB — runs at build time + revalidates every hour
async function getStats() {
  try {
    await connectDB();
    const [totalUsers, totalGenerations] = await Promise.all([
      User.countDocuments(),
      History.countDocuments(),
    ]);
    return {
      tools:       `${TOOLS.length}+`,
      users:       formatCount(totalUsers),
      generations: formatCount(totalGenerations),
      uptime:      "99.9%",
    };
  } catch {
    // Fallback if DB unreachable at build time
    return { tools: `${TOOLS.length}+`, users: "10K+", generations: "1M+", uptime: "99.9%" };
  }
}

export default async function AboutPage() {
  const stats = await getStats();

  const STATS = [
    { value: stats.tools,       label: "AI Tools",        icon: "🛠️" },
    { value: stats.users,       label: "Active Users",     icon: "👥" },
    { value: stats.generations, label: "Generations Made", icon: "⚡" },
    { value: stats.uptime,      label: "Uptime",           icon: "🔒" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-500/8 rounded-full blur-[120px]" />
          </div>
          <MotionInView className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface-card text-slate-400 text-sm mb-6">
              🏢 Our Story
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-800 text-white leading-tight mb-6">
              Built for creators<br />
              <span className="gradient-text">who move fast</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              OmniAITool was born from a simple frustration — too many AI tools scattered across too many tabs.
              We built the all-in-one platform we always wished existed.
            </p>
          </MotionInView>
        </section>

        {/* Stats — real data from DB, refreshes every hour */}
        <section className="py-12 px-6 border-y border-surface-border">
          <StaggerList className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <StaggerItem key={s.label}>
                <div className="text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="font-display text-4xl font-800 gradient-text mb-1">{s.value}</div>
                  <div className="text-sm text-slate-500">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>
        </section>

        {/* Main content */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">

            {/* Mission */}
            <MotionInView className="glass-card rounded-2xl p-8 md:p-12 mb-16">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/25 flex items-center justify-center text-3xl flex-shrink-0">🎯</div>
                <div>
                  <h2 className="font-display text-2xl font-700 text-white mb-4">Our Mission</h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-4">
                    To democratize AI-powered content creation. We believe every writer, marketer, and entrepreneur —
                    regardless of budget or technical background — should have access to professional-grade AI tools.
                  </p>
                  <p className="text-slate-500 leading-relaxed">
                    No prompt engineering PhD required. No $500/month budget. Just open OmniAITool and start creating.
                  </p>
                </div>
              </div>
            </MotionInView>

            {/* Values */}
            <div className="mb-16">
              <MotionInView className="text-center mb-10">
                <h2 className="font-display text-3xl font-700 text-white">What We Stand For</h2>
              </MotionInView>
              <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {VALUES.map((v) => (
                  <StaggerItem key={v.title}>
                    <div className="glass-card rounded-2xl p-6 hover:border-brand-500/20 transition-all h-full">
                      <div className="text-3xl mb-3">{v.icon}</div>
                      <h3 className="font-display font-600 text-white text-lg mb-2">{v.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            </div>

            {/* Timeline */}
            <div className="mb-16">
              <MotionInView className="text-center mb-10">
                <h2 className="font-display text-3xl font-700 text-white">Our Journey</h2>
              </MotionInView>
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-px bg-surface-border" />
                <StaggerList className="space-y-6">
                  {TIMELINE.map((item, i) => (
                    <StaggerItem key={i}>
                      <div className="flex items-start gap-6 pl-16 relative">
                        <div className="absolute left-0 top-1 w-12 h-12 rounded-full bg-surface-card border-2 border-brand-500/40 flex items-center justify-center text-xl">
                          {item.icon}
                        </div>
                        <div className="glass-card rounded-xl px-5 py-4 flex-1 hover:border-brand-500/20 transition-all">
                          <span className="text-xs font-bold text-brand-400 uppercase tracking-wide">{item.year}</span>
                          <p className="text-sm text-white mt-0.5">{item.event}</p>
                        </div>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>
            </div>

            {/* Team */}
            <div className="mb-16">
              <MotionInView className="text-center mb-10">
                <h2 className="font-display text-3xl font-700 text-white">The Team</h2>
              </MotionInView>
              <StaggerList className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {TEAM.map((member) => (
                  <StaggerItem key={member.name}>
                    <div className="glass-card rounded-2xl p-6 text-center hover:border-white/10 transition-all group h-full">
                      <div className={`w-16 h-16 rounded-full ${member.bg} border border-white/10 flex items-center justify-center text-xl font-bold text-white mx-auto mb-3 group-hover:scale-105 transition-transform`}>
                        {member.avatar}
                      </div>
                      <p className="text-sm font-semibold text-white">{member.name}</p>
                      <p className="text-xs text-brand-400 mt-0.5 mb-2">{member.role}</p>
                      <p className="text-xs text-slate-500">{member.bio}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerList>
            </div>

            {/* CTA */}
            <MotionInView className="glass-card rounded-2xl p-10 text-center border-brand-500/15">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="font-display text-2xl font-700 text-white mb-3">Ready to create smarter?</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                Join {stats.users} creators using OmniAITool every day. Start free — 50 credits, no credit card needed.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/register" className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all shadow-glow-sm hover:shadow-glow-md">
                  Get started free →
                </Link>
                <Link href="/tools" className="px-8 py-3 rounded-xl border border-surface-border text-slate-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all hover:bg-white/5">
                  Browse all tools
                </Link>
              </div>
            </MotionInView>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
