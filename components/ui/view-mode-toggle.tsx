"use client"
import { Switch } from './switch'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewMode = 'grid' | 'list'

interface ViewModeToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}

export function ViewModeToggle({ value, onChange, className }: ViewModeToggleProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('flex items-center gap-1 text-xs', value === 'grid' ? 'font-semibold' : 'opacity-60')}> 
        <LayoutGrid className="h-4 w-4" /> Grid
      </span>
      <Switch
        checked={value === 'list'}
        onCheckedChange={checked => onChange(checked ? 'list' : 'grid')}
        aria-label="Toggle list/grid view"
      />
      <span className={cn('flex items-center gap-1 text-xs', value === 'list' ? 'font-semibold' : 'opacity-60')}> 
        <List className="h-4 w-4" /> List
      </span>
    </div>
  )
}
