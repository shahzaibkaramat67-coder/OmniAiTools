import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

const ADMIN_NAV = [
  { href: "/admin",         label: "Overview",    icon: "⊞"  },
  { href: "/admin/users",   label: "Users",       icon: "👥" },
  { href: "/admin/tools",   label: "Tools",       icon: "🛠️" },
  { href: "/admin/credits", label: "Credits",     icon: "⚡" },
  { href: "/admin/blog",    label: "Blog Posts",  icon: "✍️" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user    = session?.user as any;
  if (!session || user?.role !== "admin") redirect("/dashboard");

  return (
    <div className="flex min-h-screen">
      {/* Admin sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 bg-[#0d1020] border-r border-surface-border z-40 flex-col">
        <div className="px-5 py-5 border-b border-surface-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <span className="font-display font-700 text-sm text-white">Admin Panel</span>
          </Link>
        </div>

        <nav className="px-3 py-4 space-y-0.5 flex-1">
          {ADMIN_NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-surface-hover transition-all">
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-surface-border pt-3">
          <Link href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-white transition-colors">
            ← Back to dashboard
          </Link>
        </div>
      </aside>

      {/* Mobile admin nav bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d1020] border-t border-surface-border flex items-center justify-around px-2 py-3">
        {ADMIN_NAV.map((item) => (
          <Link key={item.href} href={item.href}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      <main className="flex-1 lg:ml-56 min-h-screen bg-surface pb-20 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
