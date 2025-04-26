'use client'

import { cn } from '@/lib/utils'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import { ReactNode } from 'react'

type IconBlockProps = {
  icon: IconName
  label?: ReactNode
  className?: string
}

export function IconBlock({ icon, label, className }: IconBlockProps) {
  return (
    <div className={cn('inline-flex flex-col items-center gap-1', className)}>
      <DynamicIcon name={icon} className="h-8 w-8" />
      {label && <span className="mt-1 text-xs">{label}</span>}
    </div>
  )
}
