export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-9 w-56 skeleton mb-3" />
        <div className="h-4 w-72 skeleton-text" />
      </div>

      {/* Action bar skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="h-10 w-64 rounded-xl skeleton" />
        <div className="h-10 w-32 rounded-full skeleton" />
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-2xl border border-gold-200/10 bg-choco-400">
        {/* Header row */}
        <div className="flex gap-6 bg-choco-600/50 px-6 py-4">
          {['w-28', 'w-20', 'w-16', 'w-16', 'w-24'].map((w, i) => (
            <div key={i} className={`h-3 ${w} skeleton-text`} />
          ))}
        </div>
        {/* Data rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-6 border-t border-gold-200/10 px-6 py-5">
            <div className="h-4 w-28 skeleton-text flex-1" />
            <div className="h-4 w-20 skeleton-text" />
            <div className="h-4 w-16 skeleton-text" />
            <div className="h-4 w-16 skeleton-text" />
            <div className="h-8 w-24 rounded-lg skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
