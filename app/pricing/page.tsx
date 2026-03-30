"use client";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui";

type Region = "pk" | "international";
type PaymentMethod = "payfast" | "easypaisa" | "jazzcash" | "paddle" | "twocheckout" | "payoneer" | "bank";

const PK_GATEWAYS: Array<{ id: PaymentMethod; name: string; icon: string; desc: string; fee: string; color: string }> = [
  { id: "payfast",   name: "PayFast",   icon: "🇵🇰", desc: "Pakistan's #1 payment gateway — cards, wallets, bank",  fee: "2.5% + PKR 10",  color: "border-green-500/40 bg-green-500/5"  },
  { id: "easypaisa", name: "EasyPaisa", icon: "💚",  desc: "Mobile wallet — most popular in Pakistan",              fee: "1.5% flat",       color: "border-emerald-500/40 bg-emerald-500/5"},
  { id: "jazzcash",  name: "JazzCash",  icon: "🟠",  desc: "Mobile wallet & debit cards — 50M+ users in Pakistan",  fee: "1.5% flat",       color: "border-orange-500/40 bg-orange-500/5" },
];

const INT_GATEWAYS: Array<{ id: PaymentMethod; name: string; icon: string; desc: string; fee: string; color: string }> = [
  { id: "paddle",      name: "Paddle",      icon: "🌍", desc: "Visa, Mastercard, PayPal, Apple Pay, Google Pay — 200+ countries", fee: "5% + $0.50",   color: "border-brand-500/40 bg-brand-500/5"  },
  { id: "twocheckout", name: "2Checkout",   icon: "💳", desc: "Visa, Mastercard, PayPal — lowest commission gateway",            fee: "3.5% + $0.35", color: "border-purple-500/40 bg-purple-500/5" },
  { id: "payoneer",    name: "Payoneer",    icon: "🔵", desc: "International bank transfer, Mastercard debit",                  fee: "2% + $3 flat",  color: "border-blue-500/40 bg-blue-500/5"    },
];

const PLANS = [
  { name:"Free",    price:"$0",  period:"",    credits:50,   product:null,             color:"border-surface-border",  highlighted:false,
    features:[{t:"50 free credits (one-time)",ok:true},{t:"All text tools",ok:true},{t:"Basic history",ok:true},{t:"AI Media tools",ok:false},{t:"Priority generation",ok:false}],
    cta:"Get started free", href:"/register" },
  { name:"Starter", price:"$9",  period:"/mo", credits:500,  product:"starter_monthly",color:"border-brand-500/50",    highlighted:true,  badge:"Most Popular",
    features:[{t:"500 credits/month",ok:true},{t:"All text & SEO tools",ok:true},{t:"Full history",ok:true},{t:"AI Media (basic)",ok:true},{t:"Priority generation",ok:true}],
    cta:"Get Starter", href:null },
  { name:"Pro",     price:"$29", period:"/mo", credits:1500, product:"pro_monthly",    color:"border-accent/40",       highlighted:false,
    features:[{t:"1,500 credits/month",ok:true},{t:"All 50+ tools",ok:true},{t:"Unlimited history",ok:true},{t:"AI Media (full)",ok:true},{t:"Priority generation",ok:true}],
    cta:"Go Pro", href:null },
];

const PACKS = [
  { credits:50,   price:"$4",  label:"Starter Pack", popular:false, product:"pack_micro"    },
  { credits:150,  price:"$10", label:"Value Pack",   popular:true,  product:"pack_standard" },
  { credits:500,  price:"$28", label:"Power Pack",   popular:false, product:"pack_pro"      },
  { credits:1500, price:"$69", label:"Agency Pack",  popular:false, product:"pack_enterprise"},
];

const FAQ = [
  { q:"What is a credit?",             a:"Credits are consumed per generation. Simple tools cost 2–5 credits. Advanced tools cost 10–30 credits." },
  { q:"Do credits expire?",            a:"One-time pack credits never expire. Monthly subscription credits reset each billing cycle." },
  { q:"Which gateway should I use?",   a:"Pakistan users: PayFast, EasyPaisa, or JazzCash. International users: Paddle (lowest effort), 2Checkout (lowest fee), or Payoneer." },
  { q:"Is there a free trial?",        a:"Yes — every account starts with 50 free credits, no card needed." },
  { q:"Are payments secure?",          a:"All payments go through your chosen provider's secure checkout. We never store card details." },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading]   = useState<string | null>(null);
  const [modal,   setModal]     = useState(false);
  const [product, setProduct]   = useState<string | null>(null);
  const [region,  setRegion]    = useState<Region>("pk");
  const [method,  setMethod]    = useState<PaymentMethod>("payfast");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === "Asia/Karachi") { setRegion("pk"); setMethod("payfast"); }
      else                       { setRegion("international"); setMethod("paddle"); }
    } catch {}
  }, []);

  useEffect(() => {
    if (region === "pk" && !["payfast","easypaisa","jazzcash","bank"].includes(method)) setMethod("payfast");
    if (region === "international" && !["paddle","twocheckout","payoneer","bank"].includes(method)) setMethod("paddle");
  }, [region, method]);

  const openModal = (prod: string) => {
    if (!session?.user) { router.push("/register?redirect=/pricing"); return; }
    setProduct(prod); setModal(true);
  };

  const handleCheckout = async () => {
    if (!product) return;
    setLoading(product);
    try {
      const res  = await fetch("/api/payment/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, method, region }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Checkout failed");
      if (data?.checkoutUrl)    { window.location.href = data.checkoutUrl; return; }
      if (data?.instructionsUrl){ window.open(data.instructionsUrl, "_blank"); toast.success("Payment instructions opened!"); setModal(false); return; }
      throw new Error("No checkout URL returned");
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally { setLoading(null); }
  };

  const selPack  = PACKS.find(p  => p.product === product);
  const selPlan  = PLANS.find(p  => p.product === product);
  const selLabel = selPack?.label ?? selPlan?.name ?? "";
  const selPrice = selPack?.price ?? selPlan?.price ?? "";
  const selCr    = selPack?.credits ?? selPlan?.credits ?? 0;
  const selPer   = selPlan?.period ?? "";
  const gateways = region === "pk" ? PK_GATEWAYS : INT_GATEWAYS;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* ── Checkout modal ──────────────────────────────────── */}
      <Modal open={modal} onClose={() => setModal(false)} title="Choose Payment Method">
        <div className="space-y-5">
          {/* Selected item */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Purchasing</p>
              <p className="font-display text-lg font-700 text-white">{selLabel}</p>
              <p className="text-sm text-slate-400">{selCr.toLocaleString()} credits{selPer && ` ${selPer}`}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Total</p>
              <p className="font-display text-3xl font-800 gradient-text">{selPrice}</p>
            </div>
          </div>

          {/* Region toggle */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Your region</p>
            <div className="grid grid-cols-2 gap-2">
              {([["pk","🇵🇰 Pakistan"],["international","🌍 International"]] as const).map(([r, label]) => (
                <button key={r} onClick={() => setRegion(r)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${region === r ? "bg-brand-500 text-white shadow-glow-sm" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Gateway cards */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">Payment gateway</p>
            <div className="space-y-2">
              {gateways.map((gw) => (
                <button key={gw.id} onClick={() => setMethod(gw.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${method === gw.id ? gw.color + " scale-[1.01] shadow-glow-sm" : "border-white/8 bg-white/3 hover:border-white/15"}`}>
                  <span className="text-2xl flex-shrink-0">{gw.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{gw.name}</p>
                    <p className="text-xs text-slate-400 truncate">{gw.desc}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-slate-500 font-semibold">Fee</p>
                    <p className="text-xs text-slate-300 font-semibold">{gw.fee}</p>
                  </div>
                  {method === gw.id && <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">✓</span>}
                </button>
              ))}
              {/* Bank transfer */}
              <button onClick={() => setMethod("bank")}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${method === "bank" ? "border-slate-400/40 bg-slate-400/5 scale-[1.01]" : "border-white/8 bg-white/3 hover:border-white/15"}`}>
                <span className="text-2xl flex-shrink-0">🏦</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Bank Transfer</p>
                  <p className="text-xs text-slate-400">{region === "pk" ? "Direct bank transfer in PKR" : "International wire transfer"}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-slate-500 font-semibold">Fee</p>
                  <p className="text-xs text-slate-300 font-semibold">0%</p>
                </div>
                {method === "bank" && <span className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 text-white text-[10px] font-bold">✓</span>}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModal(false)} className="flex-1 py-3 rounded-xl border border-surface-border text-slate-300 hover:text-white text-sm font-medium transition-all">
              Cancel
            </button>
            <button onClick={handleCheckout} disabled={!!loading}
              className="flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition-all shadow-glow-sm disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (<><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Opening…</>) : <>Continue to {gateways.find(g=>g.id===method)?.name ?? "Bank Transfer"} →</>}
            </button>
          </div>
          <p className="text-center text-xs text-slate-600">🔒 Secure checkout · We never store payment details</p>
        </div>
      </Modal>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-surface-border bg-surface-card text-slate-400 text-sm mb-6">💳 Simple, transparent pricing</div>
            <h1 className="font-display text-5xl md:text-6xl font-800 text-white mb-4">Start free, <span className="gradient-text">scale fast</span></h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">No hidden fees. Cancel anytime. Pay with Pakistan or international gateways.</p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-7 flex flex-col border-2 ${plan.color} ${plan.highlighted ? "bg-brand-500/8 shadow-glow-md" : "bg-surface-card"} transition-all`}>
                {(plan as any).badge && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-500 text-white text-xs font-bold shadow-glow-sm whitespace-nowrap">{(plan as any).badge}</div>}
                <div className="mb-6">
                  <p className="font-display font-700 text-white text-lg mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1 mb-2"><span className="font-display text-5xl font-800 text-white leading-none">{plan.price}</span><span className="text-slate-400 text-sm mb-1">{plan.period}</span></div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 mb-6">
                  <span className="text-lg">⚡</span><span className="text-sm font-semibold text-white">{plan.credits.toLocaleString()} credits</span>
                  {plan.period && <span className="text-xs text-slate-500 ml-auto">per month</span>}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f.t} className={`flex items-start gap-2.5 text-sm ${f.ok ? "text-slate-300" : "text-slate-600 line-through"}`}>
                      <span className={`mt-0.5 flex-shrink-0 ${f.ok ? "text-brand-400" : "text-slate-700"}`}>{f.ok ? "✓" : "✕"}</span>{f.t}
                    </li>
                  ))}
                </ul>
                {plan.href ? (
                  <Link href={plan.href} className="w-full text-center py-3.5 rounded-xl font-semibold text-sm border border-surface-border text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all">{plan.cta}</Link>
                ) : (
                  <button onClick={() => openModal(plan.product!)} disabled={loading === plan.product}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 ${plan.highlighted ? "bg-brand-500 hover:bg-brand-400 text-white shadow-glow-sm hover:shadow-glow-md" : "border border-surface-border text-slate-300 hover:text-white hover:border-white/25 hover:bg-white/5"}`}>
                    {loading === plan.product ? "Opening…" : plan.cta}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Credit packs */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-700 text-white mb-3">Need more credits?</h2>
              <p className="text-slate-400 text-sm">One-time packs — never expire. Stack on top of any plan.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PACKS.map((pack) => (
                <div key={pack.credits} className={`relative glass-card rounded-2xl p-6 text-center hover:border-brand-500/30 hover:-translate-y-0.5 transition-all cursor-pointer ${pack.popular ? "border-brand-500/40 bg-brand-500/5" : ""}`}
                  onClick={() => openModal(pack.product)}>
                  {pack.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold shadow-glow-sm whitespace-nowrap">Best value</div>}
                  <div className="font-display text-3xl font-800 gradient-text mb-1">{pack.price}</div>
                  <div className="text-white font-semibold mb-1">{pack.credits.toLocaleString()} credits</div>
                  <div className="text-xs text-slate-500 mb-4">{pack.label}</div>
                  <button onClick={(e) => { e.stopPropagation(); openModal(pack.product); }} disabled={loading === pack.product}
                    className="w-full py-2.5 rounded-lg bg-brand-500/15 border border-brand-500/30 text-brand-300 hover:bg-brand-500/25 hover:text-white text-sm font-semibold transition-all disabled:opacity-60">
                    {loading === pack.product ? "Opening…" : "Buy now"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="font-display text-3xl font-700 text-white text-center mb-10">Frequently asked questions</h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <div key={item.q} className="glass-card rounded-xl p-6">
                  <h3 className="font-display font-600 text-white mb-2">{item.q}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center gap-4 px-10 py-10 rounded-2xl glass-card border-brand-500/20">
              <div className="text-4xl">🚀</div>
              <h3 className="font-display text-2xl font-700 text-white">Ready to start creating?</h3>
              <p className="text-slate-400 text-sm max-w-sm text-center">Join thousands of creators. First 50 credits are free.</p>
              <Link href="/register" className="px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-all shadow-glow-sm hover:shadow-glow-md">Get started free →</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
