import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { MotionInView } from "@/components/layout/MotionInView";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";

export const metadata: Metadata = {
  title: "Privacy Policy | OmniAITool",
  description: "Read OmniAITool's privacy policy. Learn how we collect, use, and protect your personal data.",
};

const SECTIONS = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: "OmniAITool is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at omniaitool.com. By using OmniAITool, you agree to the collection and use of information as described in this policy. Last updated: January 1, 2025.",
  },
  {
    id: "information",
    title: "2. Information We Collect",
    body: "We collect: Account Information (name, email, hashed password on registration), Usage Data (which tools you use, inputs submitted, outputs generated), Payment Information (processed entirely by Paddle — we never store card numbers), Technical Data (IP address for fraud prevention, browser type, access timestamps), and Support Communications if you contact our team.",
  },
  {
    id: "how-we-use",
    title: "3. How We Use Your Information",
    body: "We use your data for: Service Delivery (processing AI requests, managing credits), Account Management (authentication, subscriptions), Security & Fraud Prevention (IP analysis, abuse detection), Service Improvements (aggregate anonymized usage data), and Transactional Emails (account creation, password reset, low-credit alerts). We do NOT use your content to train AI models and do NOT sell your personal data to any third party.",
  },
  {
    id: "storage",
    title: "4. Data Storage & Security",
    body: "Your data is stored on MongoDB Atlas (US/EU regions) with AES-256 encryption at rest. Passwords are hashed using bcrypt with cost factor 12 — we can never read your plain-text password. All data transmitted uses TLS 1.3 (HTTPS). Only authorized personnel with a legitimate business need can access production databases, and all access is logged and audited.",
  },
  {
    id: "third-parties",
    title: "5. Third-Party Services",
    body: "We use: OpenAI (AI generation — openai.com/privacy), Paddle (payments — paddle.com/privacy), MongoDB Atlas (data storage), Cloudinary (media files), Vercel (hosting), and optionally Google OAuth for sign-in. Each provider has their own privacy policy governing their use of data.",
  },
  {
    id: "cookies",
    title: "6. Cookies & Tracking",
    body: "We use session cookies required for authentication (set by NextAuth.js, expire after 7 days or sign-out) and optional preference cookies for UI settings. We do NOT use advertising cookies, cross-site tracking cookies, or sell your browsing data. OmniAITool is completely ad-free.",
  },
  {
    id: "your-rights",
    title: "7. Your Rights",
    body: "You have the right to: Access (request a copy of your data), Correct (update via Settings page), Delete (from Settings → Danger Zone or email privacy@omniaitool.com), Export (your history and account info), and Opt-out (unsubscribe from emails via any email's unsubscribe link). We respond to all requests within 30 days.",
  },
  {
    id: "children",
    title: "8. Children's Privacy",
    body: "OmniAITool is not intended for children under 13. We do not knowingly collect data from children under 13. If you believe a child has provided us personal information, contact privacy@omniaitool.com and we will delete it immediately.",
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    body: "We may update this policy periodically. For significant changes, we update the date, email registered users, and display a notice on the platform. Your continued use after changes constitutes acceptance of the updated policy.",
  },
  {
    id: "contact",
    title: "10. Contact Us",
    body: "For privacy questions: privacy@omniaitool.com. General support: support@omniaitool.com. We respond within 2 business days. EU/UK users with unresolved complaints may contact their local data protection authority.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <MotionInView className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface-card text-slate-400 text-sm mb-6">
              🔒 Legal
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-800 text-white mb-4">Privacy Policy</h1>
            <p className="text-slate-400 text-base">
              Last updated: <span className="text-slate-300 font-medium">January 1, 2025</span>
            </p>
            <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">
              We take your privacy seriously. This policy explains exactly what data we collect,
              why we collect it, and how you can control it.
            </p>
          </MotionInView>

          {/* Quick nav */}
          <MotionInView className="glass-card rounded-2xl p-6 mb-10">
            <p className="text-sm font-semibold text-white mb-3">Quick Navigation</p>
            <div className="flex flex-wrap gap-2">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}
                  className="px-3 py-1.5 rounded-lg bg-surface-hover border border-surface-border text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all">
                  {s.title.split(". ")[1]}
                </a>
              ))}
            </div>
          </MotionInView>

          {/* Short version */}
          <MotionInView className="glass-card rounded-2xl p-6 mb-10 border-green-500/15 bg-green-500/5">
            <h2 className="font-display font-700 text-white text-lg mb-3">🛡️ The Short Version</h2>
            <ul className="space-y-2">
              {[
                "We never sell your data to anyone",
                "We never train AI models on your content",
                "We never show you ads — OmniAITool is completely ad-free",
                "Passwords are hashed — we cannot read them",
                "You can delete your account and all data anytime",
                "Payments are handled by Paddle — we never see your card details",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </MotionInView>

          {/* Full sections */}
          <StaggerList className="space-y-5">
            {SECTIONS.map((s) => (
              <StaggerItem key={s.id}>
                <div id={s.id} className="glass-card rounded-2xl p-6 md:p-8 scroll-mt-24">
                  <h2 className="font-display font-700 text-white text-xl mb-4">{s.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>

          <MotionInView className="mt-10 text-center">
            <p className="text-slate-500 text-sm">
              Questions?{" "}
              <a href="mailto:privacy@omniaitool.com" className="text-brand-400 hover:text-brand-300 transition-colors">
                privacy@omniaitool.com
              </a>
            </p>
          </MotionInView>
        </div>
      </main>
      <Footer />
    </div>
  );
}
