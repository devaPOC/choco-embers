export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-48 skeleton mb-3" />
          <div className="h-4 w-56 skeleton-text" />
        </div>
        <div className="h-10 w-36 rounded-full skeleton" />
      </div>

      {/* Product card grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-3xl border border-gold-200/10 bg-choco-400 overflow-hidden shadow-warm-md">
            {/* Image placeholder */}
            <div className="aspect-[4/3] w-full skeleton" style={{ borderRadius: 0 }} />
            {/* Content */}
            <div className="p-5 space-y-3">
              <div className="h-5 w-3/4 skeleton-text" />
              <div className="space-y-1.5">
                <div className="h-3 w-full skeleton-text" />
                <div className="h-3 w-5/6 skeleton-text" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 w-16 skeleton-text" />
                <div className="h-8 w-20 rounded-lg skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
