import { Skeleton } from '@/components/ui/skeleton'

export interface DataItemSkeletonProps {
  count?: number
}

export function DataItemSkeleton({ count = 3 }: DataItemSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-1">
            <Skeleton className="size-7" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2 opacity-70" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="size-6" />
              <Skeleton className="size-6" />
            </div>
          </div>
        ))}
    </div>
  )
}
