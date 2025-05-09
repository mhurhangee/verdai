'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { OrganizationSwitcher } from '@/components/clerk-org-switcher'
import { UserButton } from '@/components/clerk-user-button'
import { FeedbackDialog } from '@/components/feedback-dialog'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { ThemeToggle } from '@/components/theme-toggle'

import { FolderClosedIcon, LayoutDashboardIcon, Plus } from 'lucide-react'
import { mutate } from 'swr'

export type HubSidebarProps = React.ComponentProps<typeof Sidebar>

export function HubSidebar({ ...props }: HubSidebarProps) {
  const pathname = usePathname()
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/hub'}>
                  <Link href="/hub">
                    <LayoutDashboardIcon className="mr-1 inline-block size-4" />
                    Hub
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/hub/projects')}>
                  <Link href="/hub/projects">
                    <FolderClosedIcon className="mr-1 inline-block size-4" />
                    Projects
                  </Link>
                </SidebarMenuButton>
                <CreateProjectDialog onCreated={() => mutate('/api/project')}>
                  <SidebarMenuAction className="cursor-pointer">
                    <Plus /> <span className="sr-only">Add Project</span>
                  </SidebarMenuAction>
                </CreateProjectDialog>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setFeedbackOpen(true)}>
                  <FolderClosedIcon className="mr-1 inline-block size-4" />
                  Feedback
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="flex flex-row items-center justify-between">
          <UserButton />
          <ThemeToggle />
        </div>
        <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      </SidebarFooter>
    </Sidebar>
  )
}
