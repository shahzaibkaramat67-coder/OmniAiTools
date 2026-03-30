export default function DashboardLoading() {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="shimmer h-3 w-24 rounded mb-3" />
        <div className="shimmer h-8 w-48 rounded" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5">
            <div className="shimmer h-6 w-6 rounded mb-3" />
            <div className="shimmer h-7 w-16 rounded mb-1" />
            <div className="shimmer h-3 w-20 rounded" />
          </div>
        ))}
      </div>
      {/* Tools grid */}
      <div className="shimmer h-5 w-32 rounded mb-5" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5">
            <div className="shimmer h-8 w-8 rounded mb-3" />
            <div className="shimmer h-4 w-3/4 rounded mb-2" />
            <div className="shimmer h-3 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
