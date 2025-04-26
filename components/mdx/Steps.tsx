'use client'

import { cn } from '@/lib/utils'

type Step = {
  title: string
  description?: string
}

type StepsProps = {
  steps: Step[]
  className?: string
  orientation?: 'vertical' | 'horizontal'
}

export function Steps({ steps, className, orientation = 'vertical' }: StepsProps) {
  return (
    <ol className={cn(orientation === 'vertical' ? 'space-y-1' : 'flex gap-6', className)}>
      {steps.map((step, i) => (
        <li
          key={i}
          className={cn(
            'flex',
            orientation === 'vertical' ? 'items-start gap-2' : 'flex-col items-center gap-1'
          )}
        >
          <span
            className={cn(
              'border-primary bg-background text-primary flex items-center justify-center rounded-full border font-bold',
              orientation === 'vertical' ? 'mr-2 h-6 w-6' : 'mb-1 h-8 w-8 text-lg'
            )}
          >
            {i + 1}
          </span>
          <div>
            <div className="leading-tight font-medium">{step.title}</div>
            {step.description && (
              <div className="text-muted-foreground text-sm">{step.description}</div>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
