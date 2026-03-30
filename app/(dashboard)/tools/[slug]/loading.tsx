export default function ToolLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-pulse">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="shimmer h-3 w-12 rounded" />
        <span className="text-slate-700">/</span>
        <div className="shimmer h-3 w-16 rounded" />
        <span className="text-slate-700">/</span>
        <div className="shimmer h-3 w-24 rounded" />
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="shimmer w-14 h-14 rounded-2xl flex-shrink-0" />
        <div className="flex-1">
          <div className="shimmer h-7 w-64 rounded mb-2" />
          <div className="shimmer h-4 w-96 rounded mb-1" />
          <div className="shimmer h-3 w-48 rounded" />
        </div>
      </div>

      {/* Main area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5">
          <div className="shimmer h-4 w-28 rounded mb-3" />
          <div className="space-y-2 mb-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shimmer h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-surface-border">
            <div className="shimmer h-3 w-16 rounded" />
            <div className="shimmer h-9 w-36 rounded-xl" />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="shimmer h-4 w-16 rounded mb-6" />
          <div className="flex items-center justify-center h-48">
            <div className="text-slate-700 text-sm">Loading tool…</div>
          </div>
        </div>
      </div>
    </div>
  );
}
