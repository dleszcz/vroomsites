export function InventorySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Controls Bar Skeleton */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
          <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
          <div className="h-8 w-24 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-44 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
          <div className="h-8 w-32 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col"
          >
            <div className="aspect-[16/10] bg-zinc-100 dark:bg-zinc-800" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-800/60 rounded" />
              <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
