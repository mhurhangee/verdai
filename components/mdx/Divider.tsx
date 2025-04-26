'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type DividerProps = {
  label?: string | ReactNode
  className?: string
}

export function Divider({ label, className }: DividerProps) {
  return (
    <div className={cn('my-8 flex items-center gap-3', className)}>
      <hr className="border-muted flex-1" />
      {label && (
        <span className="text-muted-foreground text-xs tracking-wider uppercase">{label}</span>
      )}
      {label && <hr className="border-muted flex-1" />}
    </div>
  )
}
