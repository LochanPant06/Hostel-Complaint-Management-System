export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-sm bg-[#f4f4f5] ${className}`} />;
}

export function StatSkeleton() {
  return (
    <div className="card p-5">
      <SkeletonBlock className="h-8 w-16" />
      <SkeletonBlock className="mt-3 h-3 w-24" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, showReporter = false }) {
  const columns = showReporter
    ? "lg:grid-cols-[minmax(0,2fr)_160px_110px_110px_120px_120px]"
    : "lg:grid-cols-[minmax(0,2fr)_110px_110px_120px_120px]";

  return (
    <div className="card overflow-hidden">
      <div className={`hidden gap-4 border-b border-line px-4 py-3 lg:grid ${columns}`}>
        <SkeletonBlock className="h-3 w-20" />
        {showReporter ? <SkeletonBlock className="h-3 w-16" /> : null}
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-3 w-16" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
      <div>
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="border-b border-line px-4 py-4 last:border-b-0"
          >
            <div className={`hidden items-center gap-4 lg:grid ${columns}`}>
              <div>
                <SkeletonBlock className="h-4 w-40" />
                <SkeletonBlock className="mt-3 h-3 w-full max-w-[280px]" />
              </div>
              {showReporter ? <SkeletonBlock className="h-4 w-20" /> : null}
              <SkeletonBlock className="h-6 w-20" />
              <SkeletonBlock className="h-6 w-16" />
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="h-4 w-12" />
            </div>

            <div className="space-y-3 lg:hidden">
              <SkeletonBlock className="h-4 w-40" />
              <SkeletonBlock className="h-3 w-full" />
              <div className="flex gap-2">
                <SkeletonBlock className="h-6 w-20" />
                <SkeletonBlock className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
