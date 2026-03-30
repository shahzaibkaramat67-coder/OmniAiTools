interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={`shimmer rounded-lg ${className ?? ""}`} />;
}

export function ToolCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-3" />
      </div>
      <Skeleton className="w-3/4 h-4 mb-2" />
      <Skeleton className="w-full h-3 mb-1" />
      <Skeleton className="w-2/3 h-3" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-surface-border">
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="px-5 py-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-5 animate-pulse">
      <Skeleton className="w-8 h-8 rounded-lg mb-3" />
      <Skeleton className="w-16 h-7 mb-1" />
      <Skeleton className="w-24 h-3" />
    </div>
  );
}
