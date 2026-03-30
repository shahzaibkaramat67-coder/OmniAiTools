import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl",
        hover && "transition-all duration-200 hover:border-brand-500/25 hover:bg-brand-500/5 hover:-translate-y-0.5",
        glow && "shadow-glow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-surface-border", className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 pb-6 pt-4 border-t border-surface-border", className)}>
      {children}
    </div>
  );
}
