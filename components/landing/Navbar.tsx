"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { transitions } from "@/lib/motion";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const pathname = usePathname();

  // Is the user on the homepage?
  const isHome = pathname === "/";

  // Smart link: on homepage scroll to section, on other pages go to /#section
  const navLink = (hash: string) => (isHome ? hash : `/${hash}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={transitions.smooth}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0f1117]/90 backdrop-blur-xl border-b border-white/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center text-sm font-bold shadow-glow-sm">
            O
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-white">
            Omni<span className="gradient-text">AI</span>Tool
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <Link href={navLink("#tools")}    className="hover:text-white transition-colors">Tools</Link>
          <Link href={navLink("#features")} className="hover:text-white transition-colors">Features</Link>
          <Link href="/pricing"             className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/blog"                className="hover:text-white transition-colors">Blog</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 text-sm rounded-lg border border-surface-border text-slate-400 hover:text-white hover:border-white/20 transition-all"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="px-5 py-2 text-sm rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-all shadow-glow-sm hover:shadow-glow-md">
                Get started free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden border-t border-surface-border bg-[#0f1117]/95 backdrop-blur-xl"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <Link href={navLink("#tools")} onClick={() => setMobileOpen(false)} className="text-sm text-slate-300 hover:text-white">
                Tools
              </Link>
              <Link href={navLink("#features")} onClick={() => setMobileOpen(false)} className="text-sm text-slate-300 hover:text-white">
                Features
              </Link>
              <Link href="/pricing" onClick={() => setMobileOpen(false)} className="text-sm text-slate-300 hover:text-white">
                Pricing
              </Link>
              <Link href="/blog" onClick={() => setMobileOpen(false)} className="text-sm text-slate-300 hover:text-white">
                Blog
              </Link>
              <hr className="border-surface-border" />
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white text-center"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm text-slate-300 hover:text-white">
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white text-center"
                  >
                    Get started free
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
