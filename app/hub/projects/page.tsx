'use client'

import { HubLayout } from '@/components/hub-layout'
import { ProjectsPageAction, ProjectsPageContent } from '@/components/projects-page'
import { FolderClosedIcon } from 'lucide-react'
import { useState } from 'react'

export default function ProjectsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  function handleProjectCreated() {
    // Force a refresh of the content by updating the key
    setRefreshKey(prev => prev + 1)
  }

  return (
    <HubLayout
      title="Projects"
      icon={<FolderClosedIcon size={24} />}
      description="Create and manage your AI projects."
      breadcrumbs={[{ label: 'Projects', href: '/hub/projects' }]}
      primaryAction={<ProjectsPageAction onCreated={handleProjectCreated} />}
    >
      <ProjectsPageContent key={refreshKey} />
    </HubLayout>
  )
}
