import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-slate-300 mb-1.5">{label}</label>
      )}
      <input
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-surface-card border text-white placeholder-slate-600 text-sm focus:outline-none transition-all",
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-surface-border focus:border-brand-500/60 focus:bg-brand-500/5",
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-600 mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export function Textarea({ label, hint, error, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-slate-300 mb-1.5">{label}</label>
      )}
      <textarea
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-surface-card border text-white placeholder-slate-600 text-sm focus:outline-none transition-all resize-none",
          error
            ? "border-red-500/50 focus:border-red-500"
            : "border-surface-border focus:border-brand-500/60 focus:bg-brand-500/5",
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-600 mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}
