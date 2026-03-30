import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { MotionInView } from "@/components/layout/MotionInView";
import { StaggerList, StaggerItem } from "@/components/layout/MotionStagger";

export const metadata: Metadata = {
  title: "Terms of Service | OmniAITool",
  description: "Read OmniAITool's Terms of Service. Understand your rights and responsibilities when using our AI platform.",
};

const SECTIONS = [
  { id: "acceptance",     title: "1. Acceptance of Terms",           body: "By creating an account or using OmniAITool, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the Platform. These Terms form a legally binding agreement between you and OmniAITool. Last updated: January 1, 2025." },
  { id: "eligibility",    title: "2. Eligibility",                   body: "You must be at least 13 years old to use OmniAITool. Users aged 13–18 require parental or guardian consent. By using the Platform you confirm you have the legal capacity to enter into these Terms and that all information you provide is accurate." },
  { id: "accounts",       title: "3. Account Responsibilities",      body: "You must provide accurate registration information. You are responsible for maintaining your account credentials. You may not create multiple accounts to obtain free credits or circumvent restrictions — one account per person. Accounts may not be shared or transferred. No bots or automated account creation is permitted." },
  { id: "credits",        title: "4. Credits, Payments & Refunds",   body: "Credits are consumed on each AI generation. Free credits (50 on signup) are one-time, non-transferable, and cannot be redeemed for cash. Subscription credits reset monthly and do not roll over. Purchased credit packs never expire. Due to the digital nature of AI generation, consumed credits are generally non-refundable. Platform errors automatically trigger credit refunds. Report billing disputes within 7 days to billing@omniaitool.com. Paddle handles all applicable taxes." },
  { id: "acceptable-use", title: "5. Acceptable Use Policy",         body: "You must NOT use OmniAITool to: generate illegal content, hate speech, violent or discriminatory material, deliberate misinformation, spam or phishing, sexual content involving minors (strictly prohibited — results in immediate termination and report to authorities), non-consensual deepfakes, or to circumvent platform limits via proxies or VPNs. Violations result in immediate account suspension without refund." },
  { id: "ip",             title: "6. Intellectual Property",         body: "You retain ownership of your inputs and AI-generated outputs. You grant OmniAITool a limited license to process your inputs to provide the service. We do not use your content to train AI models. OmniAITool's platform, code, branding, and design are our intellectual property and may not be copied without written permission. You are responsible for ensuring AI-generated content does not infringe third-party rights." },
  { id: "disclaimers",    title: "7. Disclaimers & AI Limitations",  body: "AI-generated content may be inaccurate, incomplete, biased, or inappropriate. You are solely responsible for reviewing and verifying all outputs before use. Nothing generated constitutes legal, financial, medical, or other professional advice. We do not guarantee accuracy, originality, or suitability of AI outputs. The Platform is provided 'as is' without warranties of any kind." },
  { id: "liability",      title: "8. Limitation of Liability",       body: "OmniAITool shall not be liable for indirect, incidental, consequential, or punitive damages. Our total liability for any claims shall not exceed the greater of: (a) amounts you paid us in the 12 months preceding the claim, or (b) $50 USD. Some jurisdictions do not allow these limitations — in such cases our liability is limited to the maximum extent permitted by applicable law." },
  { id: "termination",    title: "9. Termination",                   body: "You may cancel your account anytime from Settings → Danger Zone. We may suspend or terminate accounts immediately for Terms violations, fraudulent behavior, or non-payment without notice or refund. Upon termination your right to use the Platform ceases immediately. Credits are forfeited upon termination for violations." },
  { id: "governing-law",  title: "10. Governing Law & Disputes",     body: "For disputes, contact legal@omniaitool.com first — we aim to resolve issues informally within 30 days. Remaining disputes are resolved through binding arbitration. You agree to resolve disputes with OmniAITool on an individual basis only, not as part of a class action." },
  { id: "general",        title: "11. General Provisions",           body: "These Terms and our Privacy Policy form the entire agreement between you and OmniAITool. If any provision is found unenforceable, remaining provisions continue in full effect. Our failure to enforce any right is not a waiver of that right. You may not assign your rights under these Terms." },
  { id: "contact",        title: "12. Contact",                      body: "Legal questions: legal@omniaitool.com. Support: support@omniaitool.com. Billing: billing@omniaitool.com. We respond within 2 business days." },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <MotionInView className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface-card text-slate-400 text-sm mb-6">
              📄 Legal
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-800 text-white mb-4">Terms of Service</h1>
            <p className="text-slate-400 text-base">
              Last updated: <span className="text-slate-300 font-medium">January 1, 2025</span>
            </p>
            <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed">
              Please read these terms carefully before using OmniAITool.
              By creating an account you agree to be bound by these terms.
            </p>
          </MotionInView>

          {/* Table of contents */}
          <MotionInView className="glass-card rounded-2xl p-6 mb-10">
            <p className="text-sm font-semibold text-white mb-3">Table of Contents</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}
                  className="px-3 py-2 rounded-lg bg-surface-hover border border-surface-border text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all truncate">
                  {s.title}
                </a>
              ))}
            </div>
          </MotionInView>

          {/* Key points */}
          <MotionInView className="glass-card rounded-2xl p-6 mb-10 border-yellow-500/15 bg-yellow-500/5">
            <h2 className="font-display font-700 text-white text-lg mb-3">📌 Key Points</h2>
            <ul className="space-y-2">
              {[
                "You must be 13+ to use OmniAITool",
                "One account per person — no credit farming with multiple accounts",
                "Free credits: 50 one-time on signup, non-transferable",
                "You own your content — we never train AI on it",
                "Accounts suspended for violations without refund",
                "AI output may be inaccurate — always verify before use",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="text-yellow-400 flex-shrink-0 mt-0.5">→</span>
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

          {/* Related links */}
          <MotionInView className="mt-10 glass-card rounded-2xl p-6">
            <p className="text-sm font-semibold text-white mb-3">Related Documents</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/privacy"
                className="px-4 py-2 rounded-lg border border-surface-border text-slate-400 hover:text-white hover:border-white/20 text-sm transition-all">
                🔒 Privacy Policy
              </Link>
              <Link href="/pricing"
                className="px-4 py-2 rounded-lg border border-surface-border text-slate-400 hover:text-white hover:border-white/20 text-sm transition-all">
                💳 Pricing & Credits
              </Link>
              <a href="mailto:legal@omniaitool.com"
                className="px-4 py-2 rounded-lg border border-surface-border text-slate-400 hover:text-white hover:border-white/20 text-sm transition-all">
                📧 Contact Legal
              </a>
            </div>
          </MotionInView>

        </div>
      </main>
      <Footer />
    </div>
  );
}
