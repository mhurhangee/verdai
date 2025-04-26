'use client'

import { useState, useCallback } from 'react'
import { ViewMode, SortDirection } from '@/components/datadisplay'
import { loadViewMode, saveViewMode, getViewModeKey } from '@/lib/dataview'

export interface UseDataViewOptions<T> {
  section: string
  defaultSortField?: T
  defaultSortDirection?: SortDirection
  defaultViewMode?: ViewMode
  defaultSearchTerm?: string
  id?: string // Optional ID for section-specific instances (e.g., project ID)
}

/**
 * A reusable hook for managing data display state (search, sort, view mode)
 */
export function useDataView<T extends string>({
  section,
  defaultSortField,
  defaultSortDirection = 'desc',
  defaultViewMode = 'list',
  defaultSearchTerm = '',
  id,
}: UseDataViewOptions<T>) {
  // Generate a unique persistence key for this section
  const persistKey = getViewModeKey(section, id)
  
  // Initialize view mode from localStorage
  const [viewMode, setViewMode] = useState<ViewMode>(() => 
    loadViewMode(persistKey, defaultViewMode)
  )
  
  // Initialize other state
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm)
  const [sortBy, setSortBy] = useState<T | undefined>(defaultSortField)
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection)

  // Handle view mode changes with localStorage persistence
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    saveViewMode(persistKey, mode)
  }, [persistKey])

  // Handle sort direction toggle
  const toggleSortDirection = useCallback(() => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }, [])

  return {
    // State
    viewMode,
    searchTerm,
    sortBy,
    sortDirection,
    
    // Setters
    setViewMode: handleViewModeChange,
    setSearchTerm,
    setSortBy,
    setSortDirection,
    toggleSortDirection,
    
    // Persistence key
    persistKey,
  }
}