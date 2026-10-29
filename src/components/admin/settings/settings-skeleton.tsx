export function SettingsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label="Ładowanie ustawień...">
      {/* Tabs bar skeleton */}
      <div className="flex gap-2 p-1.5 bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-x-auto">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-10 w-32 bg-slate-800/60 rounded-lg shrink-0" />
        ))}
      </div>

      {/* Main card skeleton */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-8">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-800/80 rounded-md" />
          <div className="h-4 w-96 bg-slate-800/40 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="h-4 w-28 bg-slate-800/60 rounded" />
            <div className="h-11 w-full bg-slate-950/60 border border-slate-800/80 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-800/60 rounded" />
            <div className="h-11 w-full bg-slate-950/60 border border-slate-800/80 rounded-xl" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-800/60 rounded" />
          <div className="h-24 w-full bg-slate-950/60 border border-slate-800/80 rounded-xl" />
        </div>
      </div>

      {/* Action bar skeleton */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="h-4 w-64 bg-slate-800/60 rounded" />
        <div className="h-10 w-36 bg-slate-800 rounded-lg" />
      </div>
    </div>
  );
}
