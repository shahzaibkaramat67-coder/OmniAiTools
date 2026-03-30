import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "green" | "yellow" | "red" | "purple" | "gray";
  className?: string;
}

const VARIANTS = {
  brand:  "bg-brand-500/15 text-brand-300 border border-brand-500/25",
  green:  "bg-green-400/10 text-green-400 border border-green-400/20",
  yellow: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20",
  red:    "bg-red-400/10 text-red-400 border border-red-400/20",
  purple: "bg-accent/15 text-accent-light border border-accent/25",
  gray:   "bg-slate-500/15 text-slate-400 border border-slate-500/20",
};

export function Badge({ children, variant = "brand", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", VARIANTS[variant], className)}>
      {children}
    </span>
  );
}
