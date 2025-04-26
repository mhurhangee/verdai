'use client'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, ChevronRightIcon, MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export interface DocNavItem {
  title: string
  slug: string[]
  description?: string
  order?: number
}

interface DocsNavigationProps {
  navigation: Record<string, DocNavItem[]>
}

export function DocsNav({ navigation }: DocsNavigationProps) {
  const pathname = usePathname()
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [mobileOpen, setMobileOpen] = useState(false)

  // Initialize open states when navigation loads or changes
  useEffect(() => {
    const initialState: Record<string, boolean> = {}

    // Find the active category from the current path
    const currentPath = pathname.split('/').filter(Boolean)
    const currentCategory = currentPath.length > 2 ? currentPath[2] : 'root'

    Object.keys(navigation).forEach(category => {
      // Open the current category or 'root' by default
      initialState[category] = category === currentCategory || category === 'root'
    })

    setOpenCategories(initialState)
  }, [navigation, pathname])

  // Format category title for display
  const formatCategoryTitle = (category: string) => {
    if (category === 'root') return 'Getting Started'
    return category.charAt(0).toUpperCase() + category.slice(1)
  }

  // Check if a nav item is active
  const isActive = (slug: string[]) => {
    const itemPath = `/hub/docs/${slug.join('/')}`
    return pathname === itemPath
  }

  // Toggle a category's open state
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // --- Mobile/desktop responsive navigation ---
  return (
    <>
      {/* Mobile nav trigger and sheet */}
      <div className="fixed top-0 right-5 z-10 block lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetHeader>
            <SheetTitle className="sr-only">Documentation Navigation</SheetTitle>
          </SheetHeader>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="inline-flex items-center p-0">
              <MenuIcon className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <div className="h-full overflow-y-auto">
              {renderNav(
                navigation,
                pathname,
                openCategories,
                setOpenCategories,
                toggleCategory,
                isActive,
                formatCategoryTitle
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop sidebar */}
      <div className="sticky top-20 hidden flex-shrink-0 self-start lg:block lg:w-64">
        <ScrollArea className="max-h-[calc(100vh-8rem)] overflow-y-auto">
          {renderNav(
            navigation,
            pathname,
            openCategories,
            setOpenCategories,
            toggleCategory,
            isActive,
            formatCategoryTitle
          )}
        </ScrollArea>
      </div>
    </>
  )
}

function renderNav(
  navigation: Record<string, DocNavItem[]>,
  pathname: string,
  openCategories: Record<string, boolean>,
  setOpenCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  toggleCategory: (category: string) => void,
  isActive: (slug: string[]) => boolean,
  formatCategoryTitle: (category: string) => string
) {
  return (
    <div className="w-full px-2 py-4">
      <h3 className="mb-4 px-2 text-lg font-medium">Documentation</h3>
      <div className="space-y-1">
        {Object.entries(navigation).map(([category, items]) => (
          <div key={category} className="mb-2">
            {category !== 'root' ? (
              <Collapsible
                open={openCategories[category]}
                onOpenChange={() => toggleCategory(category)}
                className="border-border hover:border-primary/30 border-l-2 pl-1 transition-colors"
              >
                <CollapsibleTrigger className="hover:bg-secondary/50 flex w-full items-center rounded-md p-2 text-sm font-medium">
                  {openCategories[category] ? (
                    <ChevronDownIcon className="text-muted-foreground mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="text-muted-foreground mr-2 h-4 w-4" />
                  )}
                  {formatCategoryTitle(category)}
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-1 pl-8">
                  <nav className="flex flex-col space-y-1">
                    {items.map((item: DocNavItem) => (
                      <Link
                        key={item.slug.join('/')}
                        href={`/hub/docs/${item.slug.join('/')}`}
                        className={cn(
                          'flex items-center rounded-md px-2 py-1.5 text-sm transition-colors',
                          isActive(item.slug)
                            ? 'bg-secondary text-foreground font-medium'
                            : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                        )}
                      >
                        <span className="truncate">{item.title}</span>
                      </Link>
                    ))}
                  </nav>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <nav className="border-border hover:border-primary/30 flex flex-col space-y-1 border-l-2 pl-3 transition-colors">
                {items.map((item: DocNavItem) => (
                  <Link
                    key={item.slug.join('/')}
                    href={`/hub/docs/${item.slug.join('/')}`}
                    className={cn(
                      'flex items-center rounded-md px-2 py-1.5 text-sm transition-colors',
                      isActive(item.slug)
                        ? 'bg-secondary text-foreground font-medium'
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span className="truncate">{item.title}</span>
                  </Link>
                ))}
              </nav>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
