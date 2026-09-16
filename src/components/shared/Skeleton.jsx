// Shimmering placeholder blocks for loading states.
export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-xl bg-black/10 dark:bg-white/10 ${className}`} />
}

export function FeedPostSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-white/5">
      <div className="flex items-center gap-2 p-3">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}
