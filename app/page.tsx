import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ToolsShowcase from "@/components/landing/ToolsShowcase";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import History from "@/models/History";
import { TOOLS } from "@/lib/tools-data";

// Revalidate every hour
export const revalidate = 3600;

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${Math.floor(n / 100_000) / 10}M+`;
  if (n >= 1_000)     return `${Math.floor(n / 1_000)}K+`;
  return n > 0 ? `${n}+` : "0";
}

async function getStats() {
  try {
    await connectDB();
    const [totalUsers, totalGenerations] = await Promise.all([
      User.countDocuments(),
      History.countDocuments(),
    ]);
    return {
      tools:       TOOLS.length,
      users:       formatCount(totalUsers),
      generations: formatCount(totalGenerations),
    };
  } catch {
    return { tools: TOOLS.length, users: "10K+", generations: "1M+" };
  }
}

export default async function HomePage() {
  const stats = await getStats();
  return (
    <main className="relative overflow-x-hidden">
      <Navbar />
      <Hero stats={stats} />
      <ToolsShowcase />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
