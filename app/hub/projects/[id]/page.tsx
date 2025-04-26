'use client'

import { HubLayout } from '@/components/hub-layout'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectActions } from '@/components/project-action-buttons'
import { fetcher } from '@/lib/fetcher'
import { formatDistanceNow } from '@/lib/format-distance-now'
import { Project } from '@/types/project'
import { FolderClosed, Clock } from 'lucide-react'
import { useParams, notFound } from 'next/navigation'
import { useEffect } from 'react'
import useSWR from 'swr'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/projects/${id}` : null, fetcher)

  useEffect(() => {
    if (error) notFound()
  }, [error])

  if (isLoading)
    return (
      <HubLayout>
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-center sm:gap-6">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
        <Card className="mb-8 w-full">
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        <Card className="mb-8 w-full">
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </HubLayout>
    )
  if (!data?.project) return notFound()
  const project: Project = data.project
  const projectId = String(project.projectId)

  return (
    <HubLayout
      title={project.projectName}
      icon={<FolderClosed size={24} />}
      description={project.description || 'No description provided'}
      breadcrumbs={[
        { label: 'Projects', href: '/hub/projects' },
        { label: project.projectName, href: `/hub/projects/${projectId}` },
      ]}
      actions={
        <>
          <div className="text-muted-foreground mr-2 flex items-center gap-2 text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistanceNow(project.updatedAt)}</span>
          </div>
          <ProjectActions project={project} onChanged={mutate} redirectOnDelete={true} />
        </>
      }
      backTo={{ label: 'Projects', href: '/hub/projects' }}
    >
      {/* Future: More project sections here */}
    </HubLayout>
  )
}
