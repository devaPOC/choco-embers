export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="h-9 w-32 skeleton mb-3" />
        <div className="h-4 w-72 skeleton-text" />
      </div>

      <div className="space-y-6">
        {/* Tabs skeleton */}
        <div className="flex gap-1 rounded-xl border border-gold-200/10 bg-choco-400 p-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-28 rounded-lg skeleton" />
          ))}
        </div>

        {/* Search skeleton */}
        <div className="h-12 w-full rounded-xl skeleton" />

        {/* Count */}
        <div className="h-3 w-20 skeleton-text" />

        {/* Order card skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-2xl border border-gold-200/10 bg-choco-400 p-4 sm:px-5">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-20 skeleton-text" />
                  <div className="h-3 w-14 skeleton-text" />
                </div>
                <div className="h-4 w-32 skeleton-text" />
              </div>
              <div className="h-4 w-16 skeleton-text hidden sm:block" />
              <div className="h-5 w-12 skeleton" />
              <div className="h-6 w-20 rounded-full skeleton" />
              <div className="h-9 w-9 rounded-full skeleton" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
