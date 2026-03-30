export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-surface-border" />
          <div className="absolute inset-0 rounded-full border-2 border-t-brand-500 animate-spin" />
        </div>
        <p className="text-slate-500 text-sm animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
