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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { editProject } from '@/lib/project-actions'
import { Project } from '@/types/project'
import { useState } from 'react'
import { toast } from 'sonner'

export interface ProjectEditDialogProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
  onChanged?: () => void
}

export function ProjectEditDialog({
  project,
  open,
  onOpenChange,
  onChanged,
}: ProjectEditDialogProps) {
  const [projectName, setProjectName] = useState(project.projectName || '')
  const [description, setDescription] = useState(project.description || '')
  const [loading, setLoading] = useState(false)

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setProjectName(project.projectName || '')
      setDescription(project.description || '')
    }
    onOpenChange(newOpen)
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) {
      toast.error('Project name required')
      return
    }
    setLoading(true)
    await editProject(
      project.id,
      { projectName, description },
      () => {
        toast.success('Project updated')
        onOpenChange(false)
        if (onChanged) onChanged()
      },
      () => toast.error('Failed to edit project')
    )
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <DialogDescription>Update your project details below.</DialogDescription>
        <form onSubmit={handleEdit} className="space-y-3">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Label className="mb-1 block text-sm font-medium">
                Project Name<span className="text-red-500">*</span>
              </Label>
              <Input
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. Website, Personal, Holiday"
                required
              />
            </div>
          </div>
          <div>
            <Label className="mb-1 block text-sm font-medium">Description (optional)</Label>
            <span className="text-muted-foreground text-xs">
              A short description of the project to help you remember what it is about
            </span>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="The rebrand of our website"
              maxLength={128}
              rows={2}
              className="w-full resize-none rounded border p-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
