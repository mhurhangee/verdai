'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Multiselect } from '@/components/ui/multiselect'
import { Textarea } from '@/components/ui/textarea'

import { parseClientIO } from '@/lib/utils/parse-client-io'

import { ProjectUpdateSchema } from '@/types/projects'

import { toast } from 'sonner'

interface HubCreateProjectDialogProps {
  children: React.ReactNode
  onCreated?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateProjectDialog({
  children,
  onCreated,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: HubCreateProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = openProp !== undefined ? openProp : internalOpen
  const onOpenChange = onOpenChangeProp !== undefined ? onOpenChangeProp : setInternalOpen
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const { success, error: parseError } = parseClientIO(ProjectUpdateSchema, {
      title,
      description,
      tags,
    })
    if (!success) {
      setError(parseError)
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, tags }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to create project')
      toast.success('Project created')
      setTitle('')
      setDescription('')
      setTags([])
      onCreated?.()
      onOpenChange(false) // Close dialog on success
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create project')
      setError(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Add a new workspace for your AI projects.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Project name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={52}
            required
            autoFocus
            disabled={loading}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            maxLength={512}
            disabled={loading}
          />
          <Multiselect
            value={tags}
            onChange={setTags}
            max={3}
            maxLength={16}
            placeholder="Add tag (max 3)"
            disabled={loading}
          />
          {error && <div className="text-destructive text-sm">{error}</div>}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost" disabled={loading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
