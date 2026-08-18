export default function Loading() {
  return (
    <div className="min-h-screen bg-choco-500">
      {/* Hero skeleton */}
      <div className="relative min-h-screen overflow-hidden bg-choco-500">
        {/* Nav skeleton */}
        <header className="fixed top-0 left-0 right-0 z-40 bg-transparent">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full skeleton" />
              <div className="h-5 w-28 skeleton-text" />
            </div>
            <div className="h-4 w-12 skeleton-text" />
          </div>
        </header>

        {/* Center content skeleton */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-5 pt-24 pb-32 text-center sm:px-8">
          {/* Logo placeholder */}
          <div className="mb-8 flex justify-center">
            <div className="h-28 w-28 rounded-full skeleton sm:h-32 sm:w-32" />
          </div>

          {/* Eyebrow */}
          <div className="mb-5 flex items-center gap-2.5">
            <div className="h-px w-8 bg-gold-200/20" />
            <div className="h-3 w-48 skeleton-text" />
            <div className="h-px w-8 bg-gold-200/20" />
          </div>

          {/* Headline skeleton */}
          <div className="mb-5 h-16 w-72 skeleton sm:h-20 sm:w-96" />

          {/* Tagline */}
          <div className="mb-8 h-6 w-56 skeleton-text sm:w-64" />

          {/* Description */}
          <div className="mb-10 flex flex-col items-center gap-2">
            <div className="h-4 w-full max-w-lg skeleton-text" />
            <div className="h-4 w-full max-w-md skeleton-text" />
            <div className="h-4 w-3/4 max-w-sm skeleton-text" />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <div className="h-14 w-52 rounded-full skeleton" />
            <div className="h-5 w-24 skeleton-text" />
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-8 w-14 skeleton sm:h-10 sm:w-20" />
                <div className="h-3 w-20 skeleton-text sm:w-28" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
