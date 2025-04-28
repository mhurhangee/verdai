"use client"
import { EditProjectDialog } from './edit-project-dialog'
import { DeleteProjectDialog } from './delete-project-dialog'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { mutate } from 'swr'
import type { Project } from '@/types/projects'

export interface ProjectActionsProps {
  project: Project
  showOpenButton?: boolean
  onUpdated?: () => void
  onDeleted?: () => void
}

export function ProjectActions({ project, showOpenButton = true, onUpdated, onDeleted }: ProjectActionsProps) {
  return (
    <div className="flex gap-2">
      <EditProjectDialog project={project} onUpdated={() => {
        mutate('/api/project')
        onUpdated?.()
      }}>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground"
          aria-label="Edit project"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </EditProjectDialog>
      <DeleteProjectDialog project={project} onDeleted={() => {
        mutate('/api/project')
        onDeleted?.()
      }}>
        <Button
          size="icon"
          variant="ghost"
          className="text-destructive"
          aria-label="Delete project"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DeleteProjectDialog>
      {showOpenButton && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/hub/projects/${project.id}`}>Open</Link>
        </Button>
      )}
    </div>
  )
}
