'use client'

import React, { Fragment, ReactNode } from 'react'

import Link from 'next/link'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { cn } from '@/lib/utils'

import { useIsMobile } from '@/hooks/use-mobile'

import { ArrowLeftIcon } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface HubPageProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  primaryAction?: ReactNode
  children?: ReactNode
  fullWidth?: boolean
  className?: string
  backTo?: {
    label: string
    href: string
  }
}

export function HubLayout({
  title,
  description,
  icon,
  breadcrumbs,
  actions,
  primaryAction,
  children,
  fullWidth = false,
  className = '',
  backTo,
}: HubPageProps) {
  const isMobile = useIsMobile()

  // Combine primary action with other actions if provided
  const combinedActions =
    primaryAction || actions ? (
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        {primaryAction && <div className="ml-2">{primaryAction}</div>}
      </div>
    ) : null

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full">
      <div
        className={cn(
          'container mx-auto px-4 py-6 sm:px-6',
          fullWidth ? 'max-w-screen-xl' : 'max-w-5xl',
          className
        )}
      >
        {/* Top Header with Sidebar Toggle and Breadcrumbs */}
        <div className="bg-background sticky top-0 z-0 mb-4 flex items-center justify-between gap-4 py-2 shadow-sm transition-all">
          <div className="flex items-center gap-4 overflow-hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className="flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent>Sidebar</TooltipContent>
            </Tooltip>

            {breadcrumbs && breadcrumbs.length > 0 && (
              <Breadcrumb className="overflow-hidden">
                <BreadcrumbList>
                  {[{ label: 'Hub', href: '/hub' }, ...breadcrumbs].map((crumb, i, arr) => {
                    const isLast = i === arr.length - 1
                    return isLast ? (
                      <BreadcrumbItem key={i}>
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <Fragment key={i}>
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link href={crumb.href || '#'}>{crumb.label}</Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                      </Fragment>
                    )
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
          {!isMobile && backTo && (
            <div>
              <Link href={backTo.href} legacyBehavior passHref>
                <Button variant="ghost" className="text-muted-foreground gap-1 px-2 font-medium">
                  <ArrowLeftIcon className="size-4" />
                  {backTo.label}
                </Button>
              </Link>
            </div>
          )}

          {/* Allow actions in the top bar for easier mobile access */}
          {isMobile && combinedActions}
        </div>

        {/* Header section */}
        {(title || description || (!isMobile && combinedActions)) && (
          <div className="mb-8">
            <div
              className={cn(
                'flex flex-wrap gap-4',
                isMobile ? 'flex-col' : 'flex-row items-center justify-between'
              )}
            >
              {title && (
                <div className="flex items-center gap-2">
                  {icon && <span className="text-primary mr-2">{icon}</span>}
                  <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                </div>
              )}
              {!isMobile && combinedActions}
            </div>
            {description && <p className="text-muted-foreground mt-2 text-lg">{description}</p>}
          </div>
        )}

        {/* Main content */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}
