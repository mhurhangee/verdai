'use client'

import { ProjectDeleteDialog } from '@/components/project-delete-dialog'
import { ProjectEditDialog } from '@/components/project-edit-dialog'
import { Button } from '@/components/ui/button'
import { Project } from '@/types/project'
import { Pencil, Trash } from 'lucide-react'
import { useState } from 'react'

export interface ProjectActionsProps {
  project: Project
  onChanged?: () => void
  redirectOnDelete?: boolean
  showEdit?: boolean
  showDelete?: boolean
  className?: string
}

export function ProjectActions({
  project,
  onChanged,
  redirectOnDelete = false,
  showEdit = true,
  showDelete = true,
  className = '',
}: ProjectActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Prevent click events from bubbling up to parent links
  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className={`flex gap-2 ${className}`} onClick={handleContainerClick}>
      {showEdit && (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={e => {
              e.stopPropagation() // Prevent parent link navigation
              setEditOpen(true)
            }}
          >
            <Pencil />
          </Button>
          <ProjectEditDialog
            project={project}
            open={editOpen}
            onOpenChange={setEditOpen}
            onChanged={onChanged || (() => {})}
          />
        </>
      )}
      {showDelete && (
        <>
          <Button
            size="icon"
            variant="ghost"
            onClick={e => {
              e.stopPropagation() // Prevent parent link navigation
              setDeleteOpen(true)
            }}
          >
            <Trash />
          </Button>
          <ProjectDeleteDialog
            project={project}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onDeleted={onChanged || (() => {})}
            redirectOnDelete={redirectOnDelete}
          />
        </>
      )}
    </div>
  )
}
