'use client'

import { cn } from '@/lib/utils'
import { InfoIcon, AlertCircleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { ReactNode } from 'react'

const icons = {
  info: InfoIcon,
  warning: AlertCircleIcon,
  success: CheckCircleIcon,
  error: XCircleIcon,
}

const colorStyles = {
  info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300',
  warning:
    'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/50 dark:text-yellow-300',
  success:
    'border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300',
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300',
}

type CalloutProps = {
  type?: 'info' | 'warning' | 'success' | 'error'
  title?: string
  children: ReactNode
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const Icon = icons[type]
  return (
    <div className={cn('my-6 flex items-start gap-3 rounded-lg border p-4', colorStyles[type])}>
      <Icon className="mt-1 h-5 w-5 shrink-0" />
      <div>
        {title && <div className="mb-1 font-medium">{title}</div>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
