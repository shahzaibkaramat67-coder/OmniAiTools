"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/tools", label: "All Tools", icon: "🛠️" },
  { href: "/history", label: "History", icon: "📜" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

const TOOL_NAV = [
  { href: "/tools?category=writing", label: "Writing", icon: "✍️", color: "text-blue-400" },
  { href: "/tools?category=seo", label: "SEO", icon: "📈", color: "text-green-400" },
  { href: "/tools?category=social", label: "Social Media", icon: "📸", color: "text-pink-400" },
  { href: "/tools?category=productivity", label: "Productivity", icon: "⚡", color: "text-yellow-400" },
  { href: "/tools?category=marketing", label: "Marketing", icon: "🎯", color: "text-orange-400" },
  { href: "/tools?category=advanced", label: "Advanced", icon: "🔮", color: "text-purple-400" },
  { href: "/tools?category=media", label: "AI Media", icon: "🎨", color: "text-red-400" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user as any;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track category to force re-render on query change
  const [currentCategory, setCurrentCategory] = useState<string>("");

  useEffect(() => {
    setMobileOpen(false);
    setCurrentCategory(searchParams?.get("category") ?? "");
  }, [pathname, searchParams?.toString()]); // <-- important

  const PLAN_MAX: Record<string, number> = { free: 10, starter: 200, pro: 1000 };
  const credits = user?.credits ?? 0;
  const plan = user?.plan ?? "free";
  const creditPct = Math.min(100, (credits / (PLAN_MAX[plan] ?? 10)) * 100);

  const SidebarContent = () => {
    return (
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-surface-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center text-xs font-bold shadow-glow-sm">
              O
            </div>
            <span className="font-display font-700 text-sm text-white">
              Omni<span className="gradient-text">AI</span>Tool
            </span>
          </Link>
        </div>

        {/* Main nav */}
        <nav className="px-3 py-4 space-y-0.5 flex-shrink-0">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  active
                    ? "bg-brand-500/15 text-white border border-brand-500/25"
                    : "text-slate-400 hover:text-white hover:bg-surface-hover"
                )}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Category nav */}
        <div className="px-3 py-2 flex-shrink-0">
          <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">
            Categories
          </p>
          <div className="space-y-0.5">
            {TOOL_NAV.map((item) => {
              const itemCategory = new URLSearchParams(item.href.split("?")[1]).get("category");
              const active = pathname === "/tools" && itemCategory === currentCategory;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
                    active
                      ? "text-white bg-surface-hover"
                      : "text-slate-500 hover:text-white hover:bg-surface-hover"
                  )}
                >
                  <span className={cn("w-4 text-center", item.color)}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex-1" />

        {/* Credits bar */}
        {user && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-surface-hover border border-surface-border flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 font-medium">Credits</span>
              <span className="text-xs font-bold text-white">{credits.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden mb-2.5">
              <div
                className={cn(
                  "h-full rounded-full transition-all bg-gradient-to-r",
                  creditPct > 50
                    ? "from-brand-500 to-accent"
                    : creditPct > 20
                    ? "from-yellow-500 to-orange-400"
                    : "from-red-500 to-red-400"
                )}
                style={{ width: `${creditPct}%` }}
              />
            </div>
            <Link
              href="/pricing"
              className="w-full block text-center text-[10px] font-semibold py-1.5 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors"
            >
              + Buy more credits
            </Link>
          </div>
        )}

        {/* User footer */}
        {user && (
          <div className="px-3 pb-4 border-t border-surface-border pt-3 flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-500/25 border border-brand-500/35 flex items-center justify-center text-xs font-bold text-brand-300 flex-shrink-0">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate capitalize">{plan} plan</p>
              </div>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  title="Admin panel"
                  className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
                >
                  ADM
                </Link>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left text-xs text-slate-500 hover:text-white transition-colors px-1 py-1 flex items-center gap-1.5"
            >
              <span>→</span> Sign out
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-surface-card border-r border-surface-border flex-col z-40">
        <SidebarContent />
      </aside>

      {/* Mobile button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-surface-card border border-surface-border text-slate-400 hover:text-white transition-colors shadow-card"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "lg:hidden fixed left-0 top-0 h-full w-64 bg-surface-card border-r border-surface-border z-50 flex flex-col transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-surface-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <SidebarContent />
      </aside>
    </>
  );
}










// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSession, signOut } from "next-auth/react";
// import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";

// const NAV = [
//   { href: "/dashboard", label: "Dashboard", icon: "⊞" },
//   { href: "/tools",     label: "All Tools",  icon: "🛠️" },
//   { href: "/history",   label: "History",    icon: "📜" },
//   { href: "/settings",  label: "Settings",   icon: "⚙️" },
// ];

// const TOOL_NAV = [
//   { href: "/tools?category=writing",      label: "Writing",      icon: "✍️",  color: "text-blue-400"   },
//   { href: "/tools?category=seo",          label: "SEO",          icon: "📈",  color: "text-green-400"  },
//   { href: "/tools?category=social",       label: "Social Media", icon: "📸",  color: "text-pink-400"   },
//   { href: "/tools?category=productivity", label: "Productivity", icon: "⚡",  color: "text-yellow-400" },
//   { href: "/tools?category=marketing",    label: "Marketing",    icon: "🎯",  color: "text-orange-400" },
//   { href: "/tools?category=advanced",     label: "Advanced",     icon: "🔮",  color: "text-purple-400" },
//   { href: "/tools?category=media",        label: "AI Media",     icon: "🎨",  color: "text-red-400"    },
// ];






// export default function Sidebar() {
//   const pathname          = usePathname();
//   const { data: session } = useSession();
//   const user              = session?.user as any;
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Close sidebar on route change
//   useEffect(() => { setMobileOpen(false); }, [pathname]);

//   const PLAN_MAX: Record<string, number> = { free: 10, starter: 200, pro: 1000 };
//   const credits   = user?.credits ?? 0;
//   const plan      = user?.plan    ?? "free";
//   const creditPct = Math.min(100, (credits / (PLAN_MAX[plan] ?? 10)) * 100);

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full overflow-y-auto">
//       {/* Logo */}
//       <div className="px-5 py-5 border-b border-surface-border flex-shrink-0">
//         <Link href="/" className="flex items-center gap-2">
//           <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center text-xs font-bold shadow-glow-sm">
//             O
//           </div>
//           <span className="font-display font-700 text-sm text-white">
//             Omni<span className="gradient-text">AI</span>Tool
//           </span>
//         </Link>
//       </div>

//       {/* Main nav */}
//       <nav className="px-3 py-4 space-y-0.5 flex-shrink-0">
//         {NAV.map((item) => {
//           const active = pathname === item.href;
//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
//                 active
//                   ? "bg-brand-500/15 text-white border border-brand-500/25"
//                   : "text-slate-400 hover:text-white hover:bg-surface-hover"
//               )}
//             >
//               <span className="text-base w-5 text-center">{item.icon}</span>
//               {item.label}
//               {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Category nav */}
//       <div className="px-3 py-2 flex-shrink-0">
//         <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">
//           Categories
//         </p>
//         <div className="space-y-0.5">
//           {TOOL_NAV.map((item) => {
//             const active = pathname + (typeof window !== "undefined" ? window.location.search : "") === item.href;
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={cn(
//                   "flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all",
//                   active ? "text-white bg-surface-hover" : "text-slate-500 hover:text-white hover:bg-surface-hover"
//                 )}
//               >
//                 <span className={cn("w-4 text-center", item.color)}>{item.icon}</span>
//                 {item.label}
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* Spacer */}
//       <div className="flex-1" />

//       {/* Credits bar */}
//       {user && (
//         <div className="mx-3 mb-3 p-3 rounded-xl bg-surface-hover border border-surface-border flex-shrink-0">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs text-slate-400 font-medium">Credits</span>
//             <span className="text-xs font-bold text-white">{credits.toLocaleString()}</span>
//           </div>
//           <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden mb-2.5">
//             <div
//               className={cn(
//                 "h-full rounded-full transition-all bg-gradient-to-r",
//                 creditPct > 50 ? "from-brand-500 to-accent" :
//                 creditPct > 20 ? "from-yellow-500 to-orange-400" :
//                 "from-red-500 to-red-400"
//               )}
//               style={{ width: `${creditPct}%` }}
//             />
//           </div>
//           <Link
//             href="/pricing"
//             className="w-full block text-center text-[10px] font-semibold py-1.5 rounded-lg bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 transition-colors"
//           >
//             + Buy more credits
//           </Link>
//         </div>
//       )}

//       {/* User footer */}
//       {user && (
//         <div className="px-3 pb-4 border-t border-surface-border pt-3 flex-shrink-0">
//           <div className="flex items-center gap-2.5 mb-2.5">
//             <div className="w-8 h-8 rounded-full bg-brand-500/25 border border-brand-500/35 flex items-center justify-center text-xs font-bold text-brand-300 flex-shrink-0">
//               {user.name?.[0]?.toUpperCase() ?? "U"}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs font-semibold text-white truncate">{user.name}</p>
//               <p className="text-[10px] text-slate-500 truncate capitalize">{plan} plan</p>
//             </div>
//             {user.role === "admin" && (
//               <Link
//                 href="/admin"
//                 title="Admin panel"
//                 className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
//               >
//                 ADM
//               </Link>
//             )}
//           </div>
//           <button
//             onClick={() => signOut({ callbackUrl: "/" })}
//             className="w-full text-left text-xs text-slate-500 hover:text-white transition-colors px-1 py-1 flex items-center gap-1.5"
//           >
//             <span>→</span> Sign out
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       {/* Desktop sidebar */}
//       <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 bg-surface-card border-r border-surface-border flex-col z-40">
//         <SidebarContent />
//       </aside>

//       {/* Mobile hamburger button */}
//       <button
//         onClick={() => setMobileOpen(true)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-surface-card border border-surface-border text-slate-400 hover:text-white transition-colors shadow-card"
//       >
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//         </svg>
//       </button>

//       {/* Mobile overlay */}
//       {mobileOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Mobile sidebar drawer */}
//       <aside
//         className={cn(
//           "lg:hidden fixed left-0 top-0 h-full w-64 bg-surface-card border-r border-surface-border z-50 flex flex-col transition-transform duration-300",
//           mobileOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <div className="absolute top-4 right-4">
//           <button
//             onClick={() => setMobileOpen(false)}
//             className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-surface-hover transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//         <SidebarContent />
//       </aside>
//     </>
//   );
// }
