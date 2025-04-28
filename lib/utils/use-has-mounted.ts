import { useEffect, useState } from 'react'

/**
 * Returns true after the component has mounted (client-side only).
 * Use to gate client-only UI to avoid SSR hydration mismatches.
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => { setHasMounted(true) }, [])
  return hasMounted
}
