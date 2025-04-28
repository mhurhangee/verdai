import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { DeleteProjectDialog } from '@/components/projects/delete-project-dialog'
import { EditProjectDialog } from '@/components/projects/edit-project-dialog'

import { formatDate } from '@/lib/utils'

import type { Project } from '@/types/projects'

import { FolderClosed, CalendarDays, ArrowRight, Edit2, Trash2, Tags, FileText } from 'lucide-react'
import { mutate } from 'swr'

interface ProjectsListProps {
  projects?: Project[]
  isLoading?: boolean
}

export function ProjectsList({ projects, isLoading }: ProjectsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {isLoading ? (
        [...Array(4)].map((_, i) => <Skeleton key={i} className="h-40" />)
      ) : projects?.length ? (
        projects.map(project => <ProjectCard key={project.id} project={project} />)
      ) : (
        <div className="text-muted-foreground col-span-2 py-8 text-center">No projects found.</div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group relative transition-shadow hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderClosed className="w-4 h-4 text-muted-foreground" />
          <Link href={`/hub/projects/${project.id}`} className="flex items-center gap-2">
            {project.title}
            <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="flex items-center gap-2 text-muted-foreground line-clamp-2 text-sm">
          <FileText className="w-4 h-4 text-muted-foreground" />
          {project.description ?? 'No description'}
        </p>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <CalendarDays className="w-4 h-4" />
          <span>{formatDate(project.createdAt)}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {project.tags?.length > 0 && <Tags className="w-4 h-4 text-muted-foreground" />}
          {project.tags?.map(tag => (
            <Badge variant="outline" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <EditProjectDialog project={project} onUpdated={() => mutate('/api/project')}>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground"
              aria-label="Edit project"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </EditProjectDialog>
          <DeleteProjectDialog project={project} onDeleted={() => mutate('/api/project')}>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive"
              aria-label="Delete project"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </DeleteProjectDialog>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/hub/projects/${project.id}`}>Open</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
