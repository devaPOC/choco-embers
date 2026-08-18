export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-9 w-32 skeleton mb-3" />
        <div className="h-4 w-72 skeleton-text" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-24 rounded-full skeleton" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="overflow-x-auto rounded-2xl border border-gold-200/10 bg-choco-400">
        {/* Header row */}
        <div className="flex gap-6 bg-choco-600/50 px-6 py-4">
          {['w-24', 'w-28', 'w-20', 'w-16', 'w-20', 'w-20'].map((w, i) => (
            <div key={i} className={`h-3 ${w} skeleton-text`} />
          ))}
        </div>
        {/* Data rows */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-6 border-t border-gold-200/10 px-6 py-5">
            <div className="h-4 w-24 skeleton-text" />
            <div className="h-4 w-28 skeleton-text" />
            <div className="h-4 w-20 skeleton-text" />
            <div className="h-6 w-16 rounded-full skeleton" />
            <div className="h-4 w-20 skeleton-text" />
            <div className="h-8 w-20 rounded-lg skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
