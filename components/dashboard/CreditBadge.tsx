import Link from "next/link";
import { cn } from "@/lib/utils";

interface CreditBadgeProps {
  credits: number;
  plan?: string;
  showLink?: boolean;
  className?: string;
}

export default function CreditBadge({ credits, plan = "free", showLink = true, className }: CreditBadgeProps) {
  const PLAN_MAX: Record<string, number> = { free: 10, starter: 200, pro: 1000 };
  const max = PLAN_MAX[plan] ?? 10;
  const pct = Math.min(100, (credits / max) * 100);

  const colorClass =
    pct > 50  ? "from-brand-500 to-accent" :
    pct > 20  ? "from-yellow-500 to-orange-400" :
                "from-red-500 to-red-400";

  const badge = (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border",
        showLink && "hover:border-brand-500/40 transition-all cursor-pointer",
        className
      )}
    >
      <span className="text-sm">⚡</span>
      <span className="text-xs font-bold text-white">{credits.toLocaleString()}</span>
      <div className="w-16 h-1.5 bg-surface-border rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all", colorClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct < 20 && (
        <span className="text-[10px] text-red-400 font-semibold">Low</span>
      )}
    </div>
  );

  if (!showLink) return badge;

  return <Link href="/pricing">{badge}</Link>;
}
