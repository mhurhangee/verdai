'use client'

import { ViewMode } from '@/components/datadisplay'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ReactNode } from 'react'

export interface DataItemProps {
  // Core content
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  
  // Additional content and metadata
  metadata?: ReactNode
  tags?: ReactNode
  badges?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
  
  // Interaction
  linkTo?: string
  onClick?: () => void
  viewMode: ViewMode
  
  // Styling
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

export function DataItem({
  // Core content
  title,
  description,
  icon,
  
  // Additional content
  metadata,
  tags,
  badges,
  actions,
  footer,
  
  // Interaction
  linkTo,
  onClick,
  viewMode,
  
  // Styling
  className,
  titleClassName,
  descriptionClassName,
}: DataItemProps) {
  // Handle the click event
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  // Placeholder for empty description
  const displayDescription = description || (
    <span className="text-muted-foreground italic">No description</span>
  )

  // Build the title element with proper link handling
  const titleElement = linkTo ? (
    <Link 
      href={linkTo} 
      className={cn("block font-medium hover:underline", titleClassName)}
      onClick={(e) => e.stopPropagation()} // Prevent triggering parent onClick
    >
      {title}
    </Link>
  ) : (
    <span className={cn("font-medium", titleClassName)}>{title}</span>
  )

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'group bg-background hover:bg-muted/50 flex items-center border-b px-2 py-3 transition-all last:border-b-0',
          onClick && 'cursor-pointer',
          className
        )}
        onClick={handleClick}
      >
        {/* Icon */}
        {icon && <div className="mr-3 flex-shrink-0">{icon}</div>}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="truncate">{titleElement}</div>

          <div className={cn("text-muted-foreground mt-0.5 line-clamp-1 text-sm", descriptionClassName)}>
            {displayDescription}
          </div>

          {metadata && <div className="text-muted-foreground mt-1 text-xs">{metadata}</div>}

          {(tags || badges) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags}
              {badges}
            </div>
          )}

          {footer && <div className="mt-2">{footer}</div>}
        </div>

        {/* Actions */}
        {actions && (
          <div className="ml-4 flex items-center opacity-0 group-hover:opacity-100">{actions}</div>
        )}
      </div>
    )
  }

  // GRID VIEW
  else {
    return (
      <Card 
        className={cn('group h-full', onClick && 'cursor-pointer', className)}
        onClick={handleClick}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2">
              {icon && <span className="flex-shrink-0">{icon}</span>}
              {linkTo ? (
                <div className={cn("truncate text-base", titleClassName)}>{titleElement}</div>
              ) : (
                <CardTitle className={cn("truncate text-base", titleClassName)}>{title}</CardTitle>
              )}
            </div>
            {actions && (
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100">{actions}</div>
            )}
          </div>
          <CardDescription className={cn("mt-1 line-clamp-2", descriptionClassName)}>
            {displayDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {(tags || badges) && (
            <div className="mt-2">
              {tags}
              {badges}
            </div>
          )}

          {metadata && <div className="text-muted-foreground mt-3 text-xs">{metadata}</div>}
        </CardContent>
        {footer && <CardFooter className="p-4 pt-0">{footer}</CardFooter>}
      </Card>
    )
  }
}