'use client'

import { HubLayout } from '@/components/hub-layout'

import { LayoutDashboardIcon } from 'lucide-react'

export default function HubPage() {
  return (
    <HubLayout
      title=" VerdAI Hub"
      icon={<LayoutDashboardIcon size={24} />}
      description="Welcome to your own VerdAI hub. Access your projects, files, and documentation."
      breadcrumbs={[{ label: 'Welcome' }]}
      fullWidth
    >
    </HubLayout>
  )
}
