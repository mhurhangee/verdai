'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { UserIcon, ClockIcon } from 'lucide-react'

export type DocsMetaProps = {
  author?: string
  readingTime?: string
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | string
  tags?: string[]
  lastEdited?: string
  className?: string
}

const levelColor: Record<string, string> = {
  Beginner: 'bg-green-500 text-white',
  Intermediate: 'bg-yellow-500 text-white',
  Advanced: 'bg-red-500 text-white',
}

// Date formatting is now handled by the server component

export function DocsMeta({
  author,
  readingTime,
  level,
  tags,
  lastEdited,
  className,
}: DocsMetaProps) {
  return (
    <div className={cn('mb-2 flex flex-wrap items-center gap-3 text-sm', className)}>
      {author && (
        <span className="inline-flex items-center gap-1">
          <UserIcon className="h-4 w-4 opacity-70" />
          {author}
        </span>
      )}
      {readingTime && (
        <span className="inline-flex items-center gap-1">
          <ClockIcon className="h-4 w-4 opacity-70" />
          {readingTime}
        </span>
      )}
      {level && (
        <Badge className={cn('px-2 py-1 text-xs font-semibold', levelColor[level] || 'bg-muted')}>
          {level}
        </Badge>
      )}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Badge
              key={tag}
              className="bg-muted text-muted-foreground px-2 py-1 text-xs font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {lastEdited && (
        <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>Last edited: {lastEdited}</span>
        </span>
      )}
    </div>
  )
}
