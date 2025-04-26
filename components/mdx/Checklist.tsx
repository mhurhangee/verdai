'use client'

import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'
import { ReactNode, useState } from 'react'

type ChecklistProps = {
  items: { label: ReactNode; checked?: boolean }[]
  className?: string
}

export function Checklist({ items, className }: ChecklistProps) {
  const [checks, setChecks] = useState(items.map(i => !!i.checked))

  const toggle = (i: number) => setChecks(prev => prev.map((v, idx) => (idx === i ? !v : v)))

  return (
    <ul className={cn('space-y-2', className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className="flex cursor-pointer items-center gap-2 select-none"
          onClick={() => toggle(i)}
        >
          <span
            className={cn(
              'inline-flex h-5 w-5 items-center justify-center rounded border transition',
              checks[i]
                ? 'border-green-400 bg-green-100 text-green-600'
                : 'bg-muted border-muted-foreground text-muted-foreground'
            )}
          >
            {checks[i] ? <CheckIcon className="h-4 w-4" /> : null}
          </span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}
