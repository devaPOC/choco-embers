export default function Loading() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-9 w-40 skeleton mb-3" />
          <div className="h-4 w-60 skeleton-text" />
        </div>
        <div className="h-10 w-44 rounded-xl skeleton" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full skeleton shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 skeleton-text" />
                <div className="h-8 w-16 skeleton" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl border border-gold-200/20 bg-choco-400 p-6 shadow-warm-md">
            <div className="h-6 w-44 skeleton mb-6" />
            <div className="h-[250px] sm:h-[300px] w-full rounded-xl skeleton" />
          </div>
        ))}
      </div>
    </div>
  );
}
