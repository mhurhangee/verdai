'use client'

import { Badge as ShadcnBadge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export type BadgeProps = {
  children: ReactNode
  className?: string
}

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <ShadcnBadge {...props} className={cn(className)}>
      {children}
    </ShadcnBadge>
  )
}
