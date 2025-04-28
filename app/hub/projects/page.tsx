'use client'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

import { HubLayout } from '@/components/hub-layout'
import { CreateProjectDialog } from '@/components/projects/create-project-dialog'
import { ProjectsList } from '@/components/projects/projects-list'
import { FolderClosed } from 'lucide-react'

import { fetcher } from '@/lib/utils'

import type { Project } from '@/types/projects'

import { toast } from 'sonner'
import useSWR, { mutate } from 'swr'

export default function ProjectsPage() {
  const { data, error, isLoading } = useSWR<{ projects: Project[] }>('/api/project', fetcher)

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
        <CreateProjectDialog onCreated={() => mutate('/api/project')}>
          <Button className="cursor-pointer">Create Project</Button>
        </CreateProjectDialog>
      }
    >
      <ProjectsList projects={data?.projects} isLoading={isLoading} />
    </HubLayout>
  )
}
