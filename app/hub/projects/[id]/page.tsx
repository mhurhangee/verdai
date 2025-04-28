'use client'

import { HubPage } from '@/components/layout/HubPage'
import { FolderClosedIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ProjectsPage() {
  return (
    <HubPage
      title="Projects"
      icon={<FolderClosedIcon size={24} />}
      description="Create and manage your AI projects."
      breadcrumbs={[{ label: 'Projects', href: '/hub/projects' }]}
      primaryAction={<Button>TODO</Button>}
    >
      Projects
    </HubPage>
  )
}