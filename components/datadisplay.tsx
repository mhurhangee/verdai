'use client'

import { cn } from '@/lib/utils'
import { ReactNode, useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, ArrowDown, ArrowUp } from 'lucide-react'

export type ViewMode = 'list' | 'grid'
export type SortDirection = 'asc' | 'desc'

export interface SortOption {
  value: string
  label: string
}

export interface FilterOption {
  value: string
  label: string
}

export interface DataDisplayProps<T> {
  // Core data
  items: T[]
  
  // View mode
  viewMode?: ViewMode
  defaultViewMode?: ViewMode
  onViewModeChange?: (mode: ViewMode) => void
  persistKey?: string // Key to persist view mode in localStorage
  showViewToggle?: boolean
  
  // Search and filter
  searchTerm?: string
  onSearchChange?: (term: string) => void
  placeholder?: string
  
  // Sorting
  sortOptions?: SortOption[]
  sortBy?: string
  onSortChange?: (value: string) => void
  sortDirection?: SortDirection
  onSortDirectionChange?: (direction: SortDirection) => void
  
  // Filter options
  filterOptions?: FilterOption[]
  activeFilter?: string
  onFilterChange?: (filter: string) => void
  
  // Rendering
  emptyMessage?: string
  renderItem: (item: T, viewMode: ViewMode) => ReactNode
  renderHeader?: (viewMode: ViewMode) => ReactNode
  renderFooter?: (viewMode: ViewMode) => ReactNode
  
  // Grouping
  groupBy?: (item: T) => string
  groupLabel?: (groupKey: string, items: T[]) => ReactNode
  
  // Layout
  className?: string
}

/**
 * A unified component for displaying data collections with consistent search, sort, filter and view toggle functionality
 */
export function DataDisplay<T extends { id: string | number }>(
  {
    // Core data
    items,
    
    // View mode
    viewMode: externalViewMode,
    defaultViewMode = 'list',
    onViewModeChange,
    persistKey,
    showViewToggle = true,
    
    // Search and filter
    searchTerm,
    onSearchChange,
    placeholder = 'Search...',
    
    // Sorting
    sortOptions,
    sortBy,
    onSortChange,
    sortDirection,
    onSortDirectionChange,
    
    // Filter options
    filterOptions,
    activeFilter,
    onFilterChange,
    
    // Rendering
    emptyMessage = 'No items found',
    renderItem,
    renderHeader,
    renderFooter,
    
    // Grouping
    groupBy,
    groupLabel,
    
    // Layout
    className,
  }: DataDisplayProps<T>
) {
  // Use external viewMode if provided, otherwise manage internally
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>(defaultViewMode)
  const [internalSearchTerm, setInternalSearchTerm] = useState('')
  const [internalSortBy, setInternalSortBy] = useState(sortOptions?.[0]?.value || '')
  const [internalSortDirection, setInternalSortDirection] = useState<SortDirection>('desc')
  const [internalFilter, setInternalFilter] = useState('')
  
  const viewMode = externalViewMode || internalViewMode
  const currentSearchTerm = searchTerm !== undefined ? searchTerm : internalSearchTerm
  const currentSortBy = sortBy !== undefined ? sortBy : internalSortBy
  const currentSortDirection = sortDirection !== undefined ? sortDirection : internalSortDirection
  const currentFilter = activeFilter !== undefined ? activeFilter : internalFilter

  // Load saved view mode preference from localStorage if persistKey is provided
  useEffect(() => {
    if (!persistKey || externalViewMode) return

    try {
      const savedViewMode = localStorage.getItem(`viewMode_${persistKey}`) as ViewMode | null
      if (savedViewMode && (savedViewMode === 'list' || savedViewMode === 'grid')) {
        setInternalViewMode(savedViewMode)
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [persistKey, externalViewMode])

  // Process view mode changes and propagate to parent components
  const handleViewModeChange = (checked: boolean) => {
    const newMode = checked ? 'grid' : 'list'
    
    // Update internal state
    setInternalViewMode(newMode)
    
    // Save to localStorage if persistKey provided
    if (persistKey) {
      try {
        localStorage.setItem(`viewMode_${persistKey}`, newMode)
      } catch {
        // Ignore localStorage errors
      }
    }
    
    // Propagate to parent if callback provided
    if (onViewModeChange) {
      onViewModeChange(newMode)
    }
  }
  
  // Handle search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value
    setInternalSearchTerm(newTerm)
    if (onSearchChange) {
      onSearchChange(newTerm)
    }
  }
  
  // Handle sort changes
  const handleSortChange = (value: string) => {
    setInternalSortBy(value)
    if (onSortChange) {
      onSortChange(value)
    }
  }
  
  // Handle sort direction changes
  const handleSortDirectionChange = () => {
    const newDirection = currentSortDirection === 'asc' ? 'desc' : 'asc'
    setInternalSortDirection(newDirection)
    if (onSortDirectionChange) {
      onSortDirectionChange(newDirection)
    }
  }
  
  // Handle filter changes
  const handleFilterChange = (value: string) => {
    setInternalFilter(value)
    if (onFilterChange) {
      onFilterChange(value)
    }
  }

  // Group items if groupBy function is provided
  const groupedItems = groupBy
    ? items.reduce<Record<string, T[]>>((groups, item) => {
        const groupKey = groupBy(item)
        if (!groups[groupKey]) {
          groups[groupKey] = []
        }
        groups[groupKey].push(item)
        return groups
      }, {})
    : null

  // Generate searchbar if search or sort is enabled
  const showSearchbar = !!onSearchChange || !!onSortChange || !!onSortDirectionChange || !!onFilterChange || showViewToggle
  
  const searchBar = showSearchbar && (
    <div className="mb-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          {/* Search input */}
          {onSearchChange !== undefined && (
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={placeholder}
                className="pl-8"
                value={currentSearchTerm}
                onChange={handleSearchChange}
              />
            </div>
          )}
          
          {/* Sort dropdown */}
          {sortOptions && sortOptions.length > 0 && onSortChange && (
            <div className="flex-shrink-0">
              <select
                value={currentSortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-background py-1 px-2 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Sort direction toggle */}
          {onSortDirectionChange && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSortDirectionChange}
              className="flex-shrink-0 h-9 w-9"
              title={currentSortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {currentSortDirection === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        
        {/* Filter buttons */}
        {filterOptions && filterOptions.length > 0 && onFilterChange && (
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <Button
                key={filter.value}
                variant={currentFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange(
                  currentFilter === filter.value ? '' : filter.value
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}

        {/* View mode toggle */}
        {showViewToggle && (
          <div className="flex items-center gap-2">
            <Label htmlFor="view-mode-toggle" className="text-sm">
              List
            </Label>
            <Switch
              id="view-mode-toggle"
              checked={viewMode === 'grid'}
              onCheckedChange={handleViewModeChange}
            />
            <Label htmlFor="view-mode-toggle" className="text-sm">
              Grid
            </Label>
          </div>
        )}
      </div>
    </div>
  )

  // If items are empty, show empty message
  if (items.length === 0) {
    return (
      <div className="w-full">
        {searchBar}
        <div className="border-border flex flex-col items-center justify-center rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  // Render with groups if groupBy is provided
  if (groupedItems) {
    return (
      <div className={cn('w-full', className)}>
        {searchBar}
        {renderHeader?.(viewMode)}

        <div className="space-y-10">
          {Object.entries(groupedItems).map(([groupKey, groupItems]) => (
            <div key={groupKey} className="space-y-4">
              {groupLabel && (
                <div className="flex items-center gap-2">{groupLabel(groupKey, groupItems)}</div>
              )}

              <div
                className={cn(
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-2'
                )}
              >
                {groupItems.map(item => renderItem(item, viewMode))}
              </div>
            </div>
          ))}
        </div>

        {renderFooter?.(viewMode)}
      </div>
    )
  }

  // Render without groups
  return (
    <div className={cn('w-full', className)}>
      {searchBar}
      {renderHeader?.(viewMode)}

      <div
        className={cn(
          viewMode === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-2'
        )}
      >
        {items.map(item => renderItem(item, viewMode))}
      </div>

      {renderFooter?.(viewMode)}
    </div>
  )
}