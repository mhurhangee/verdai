import { UserButton as ClerkUserButton } from '@clerk/nextjs'

import { Skeleton } from '@/components/ui/skeleton'

export function UserButton() {
  return (
    <ClerkUserButton
      showName
      fallback={
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[160px]" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      }
    />
  )
}
