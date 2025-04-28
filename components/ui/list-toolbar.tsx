"use client"
import { Input } from './input'
import { Button } from './button'
import { ArrowUp, ArrowDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type SortOrder = 'asc' | 'desc'

interface ListToolbarProps {
  search: string
  onSearch: (q: string) => void
  sort: string
  sortOrder: SortOrder
  onSort: (field: string) => void
  onToggleSortOrder: () => void
  sortOptions: { value: string; label: string }[]
  className?: string
  children?: React.ReactNode
}

export function ListToolbar({
  search,
  onSearch,
  sort,
  sortOrder,
  onSort,
  onToggleSortOrder,
  sortOptions,
  className,
  children
}: ListToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {/* Search always full width */}
      <div className="relative w-full">
        <Input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search..."
          className="pl-8"
        />
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      {/* Sort and view toggle on the same line (mobile and up) */}
      <div className="flex flex-row items-center gap-2 w-full justify-between">
        <div className="flex gap-2 w-full max-w-xs">
          <Select value={sort} onValueChange={onSort}>
            <SelectTrigger id="sort" className="w-full h-8">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSortOrder}
            aria-label="Toggle sort order"
            className="h-8 w-8"
          >
            {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-shrink-0 flex justify-end">{children}</div>
      </div>
    </div>
  )
}
