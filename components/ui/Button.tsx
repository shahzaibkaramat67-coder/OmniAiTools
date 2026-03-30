import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const VARIANTS = {
  primary:   "bg-brand-500 hover:bg-brand-400 text-white shadow-glow-sm hover:shadow-glow-md",
  secondary: "border border-surface-border text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5",
  ghost:     "text-slate-400 hover:text-white hover:bg-surface-hover",
  danger:    "border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
