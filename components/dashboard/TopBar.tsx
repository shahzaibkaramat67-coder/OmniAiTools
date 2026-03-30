"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CreditBadge from "@/components/dashboard/CreditBadge";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tools":     "All Tools",
  "/history":   "History",
  "/settings":  "Settings",
  "/admin":     "Admin",
};

export default function TopBar() {
  const { data: session } = useSession();
  const user     = session?.user as any;
  const pathname = usePathname();

  const getLabel = () => {
    if (BREADCRUMB_MAP[pathname]) return BREADCRUMB_MAP[pathname];
    if (pathname.startsWith("/tools/")) return "Tool Runner";
    if (pathname.startsWith("/admin/")) return "Admin Panel";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8 py-4 border-b border-surface-border bg-surface/90 backdrop-blur-sm">
      {/* Left — page label (with mobile left-padding for hamburger) */}
      <div className="pl-10 lg:pl-0">
        <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">
          {getLabel()}
        </p>
      </div>

      {/* Right — credits + avatar */}
      <div className="flex items-center gap-3">
        <CreditBadge
          credits={user?.credits ?? 0}
          plan={user?.plan ?? "free"}
          showLink
        />

        {/* Avatar with dropdown */}
        <Link href="/settings" className="block">
          <div className="w-8 h-8 rounded-full bg-brand-500/25 border border-brand-500/35 flex items-center justify-center text-sm font-bold text-brand-300 select-none hover:bg-brand-500/35 transition-colors">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        </Link>
      </div>
    </header>
  );
}
