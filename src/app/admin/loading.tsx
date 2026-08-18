export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="h-9 w-48 skeleton mb-3" />
        <div className="h-4 w-64 skeleton-text" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 skeleton-text" />
                <div className="h-8 w-16 skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Low inventory table skeleton */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-5 rounded skeleton" />
          <div className="h-6 w-48 skeleton" />
        </div>
        <div className="rounded-2xl border border-gold-200/10 bg-choco-400 overflow-hidden">
          {/* Table header */}
          <div className="flex gap-4 bg-choco-600/50 px-6 py-4">
            <div className="h-3 w-20 skeleton-text" />
            <div className="h-3 w-16 skeleton-text" />
            <div className="h-3 w-24 skeleton-text" />
          </div>
          {/* Table rows */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 border-t border-gold-200/10 px-6 py-4">
              <div className="h-4 w-32 flex-1 skeleton-text" />
              <div className="h-4 w-20 skeleton-text" />
              <div className="h-4 w-16 skeleton-text" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
