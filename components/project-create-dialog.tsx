'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ApiError, handleApiResponse } from '@/lib/api-error'
import { useState, forwardRef, useImperativeHandle } from 'react'
import { toast } from 'sonner'

export interface ProjectCreateDialogRef {
  open: () => void
  close: () => void
}

export interface ProjectCreateDialogProps {
  onCreated?: () => void
  showTrigger?: boolean
}

export const ProjectCreateDialog = forwardRef<ProjectCreateDialogRef, ProjectCreateDialogProps>(
  ({ onCreated, showTrigger = true }, ref) => {
    const [open, setOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
      }),
      []
    )

    const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!projectName.trim()) {
        toast.error('Project name required')
        return
      }

      setLoading(true)
      try {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectName, description }),
        })

        await handleApiResponse(res)
        toast.success(`Project ${projectName} created`)
        setProjectName('')
        setDescription('')
        setOpen(false)
        onCreated?.()
      } catch (error) {
        const message = error instanceof ApiError ? error.message : 'Failed to create project'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button variant="outline">New Project</Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <DialogDescription>Create a project to help you stay organised.</DialogDescription>
          <form onSubmit={handleCreate} className="space-y-3">
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
                {loading ? 'Creating...' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
)
ProjectCreateDialog.displayName = 'ProjectCreateDialog'
