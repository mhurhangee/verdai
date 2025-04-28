import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { formatDate } from '@/lib/utils'

import type { Project } from '@/types/projects'

import { ArrowRight, CalendarDays, FileText, FolderClosed, Tags } from 'lucide-react'

import { ProjectActions } from './project-actions'

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
          <FolderClosed className="text-muted-foreground h-4 w-4" />
          <Link href={`/hub/projects/${project.id}`} className="flex items-center gap-2">
            {project.title}
            <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-muted-foreground line-clamp-2 flex items-center gap-2 text-sm">
          <FileText className="text-muted-foreground h-4 w-4" />
          {project.description ?? 'No description'}
        </p>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4" />
          <span>{formatDate(project.createdAt)}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {project.tags?.length > 0 && <Tags className="text-muted-foreground h-4 w-4" />}
          {project.tags?.map(tag => (
            <Badge variant="outline" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <ProjectActions project={project} />
        </div>
      </CardContent>
    </Card>
  )
}
