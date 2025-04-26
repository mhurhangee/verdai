// Generates a standardized persistency key for view mode
export function getViewModeKey(section: string, id?: string): string {
    return id ? `viewMode_${section}_${id}` : `viewMode_${section}`
}

// Loads the view mode from localStorage with fallback
export function loadViewMode(key: string, defaultMode: 'list' | 'grid' = 'list'): 'list' | 'grid' {
    if (typeof window === 'undefined') return defaultMode

    try {
        const saved = localStorage.getItem(key) as 'list' | 'grid' | null
        return saved === 'grid' || saved === 'list' ? saved : defaultMode
    } catch {
        return defaultMode
    }
}

// Saves the view mode to localStorage
export function saveViewMode(key: string, mode: 'list' | 'grid'): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(key, mode)
    } catch {
        // Ignore localStorage errors
    }
}
