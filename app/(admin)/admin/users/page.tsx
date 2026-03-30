import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import AdminUsersClient from "./AdminUsersClient";
import { MotionInView } from "@/components/layout/MotionInView";

export default async function AdminUsersPage() {
  let users: any[] = [];
  try {
    await connectDB();
    const raw = await User.find().sort({ createdAt: -1 }).lean();
    users = JSON.parse(JSON.stringify(raw));
  } catch (_) {}

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <MotionInView className="mb-8">
        <h1 className="font-display text-3xl font-700 text-white mb-1">Users</h1>
        <p className="text-slate-400 text-sm">{users.length} registered users</p>
      </MotionInView>
      <AdminUsersClient users={users} />
    </div>
  );
}
