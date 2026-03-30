import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* Desktop: offset by sidebar width. Mobile: no offset (sidebar is a drawer) */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen bg-surface">
        <TopBar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
