export function CarsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-slate-800 rounded-xl" />
          <div className="h-8 w-24 bg-slate-800 rounded-xl" />
          <div className="h-8 w-24 bg-slate-800 rounded-xl" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-44 bg-slate-800 rounded-xl" />
          <div className="h-8 w-32 bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Rows Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl gap-4"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-20 h-14 bg-slate-800 rounded-xl flex-shrink-0" />
              <div className="space-y-2 min-w-0">
                <div className="h-4 w-40 bg-slate-800 rounded" />
                <div className="h-3 w-56 bg-slate-800/60 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="h-5 w-24 bg-slate-800 rounded" />
              <div className="h-8 w-8 bg-slate-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
