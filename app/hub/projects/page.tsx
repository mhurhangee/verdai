'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { ViewModeToggle, ViewMode } from '@/components/ui/view-mode-toggle'

import { HubLayout } from '@/components/hub-layout'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { ProjectsList } from '@/components/projects/projects-list'

import { fetcher } from '@/lib/utils'
import { useLocalStorage, useIsMounted } from 'usehooks-ts'

import type { Project } from '@/types/projects'

import { FolderClosed } from 'lucide-react'
import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'

export default function ProjectsPage() {
  const { data, error, isLoading } = useSWR<{ projects: Project[] }>('/api/project', fetcher)
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('projects-view-mode', 'grid')
  const isMounted = useIsMounted()

  useEffect(() => {
    if (error) toast.error('Failed to load projects')
  }, [error])

  return (
    <HubLayout
      title={<span className="flex items-center gap-2">Projects</span>}
      description="A list of your AI project workspaces."
      icon={<FolderClosed />}
      breadcrumbs={[{ label: 'Projects' }]}
      actions={
        <div className="flex items-center gap-3">
          <CreateProjectDialog onCreated={() => mutate('/api/project')}>
            <Button className="cursor-pointer">Create Project</Button>
          </CreateProjectDialog>
        </div>
      }
    >
      <div className="mb-4 flex items-center justify-between">
        <div />
        {isMounted() && (
          <ViewModeToggle value={viewMode} onChange={setViewMode} />
        )}
      </div>
      {isMounted() && (
        <ProjectsList projects={data?.projects} isLoading={isLoading} viewMode={viewMode} />
      )}
    </HubLayout>
  )
}
