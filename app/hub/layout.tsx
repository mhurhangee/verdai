import { auth } from '@clerk/nextjs/server'

import { redirect } from 'next/navigation'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { HubSidebar } from '@/components/hub-sidebar'

export default async function HubLayout({ children }: { children: React.ReactNode }) {
  const { orgId } = await auth()

  // If user has no active organization, redirect to the organization selection page
  if (!orgId) {
    redirect(`/org`)
  }

  return (
    <SidebarProvider>
      <HubSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
