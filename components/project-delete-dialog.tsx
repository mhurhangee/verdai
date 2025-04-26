'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { deleteProject } from '@/lib/project-actions'
import { Project } from '@/types/project'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export interface ProjectDeleteDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleted?: () => void
  redirectOnDelete?: boolean
}

export function ProjectDeleteDialog({
  project,
  open,
  onOpenChange,
  onDeleted,
  redirectOnDelete = false,
}: ProjectDeleteDialogProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    await deleteProject(
      project.id,
      () => {
        if (redirectOnDelete) {
          router.push('/hub/projects')
        }
        toast.success('Project deleted')
        onOpenChange(false)
        if (onDeleted) onDeleted()
      },
      () => toast.error('Failed to delete project')
    )
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this project? This action cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
