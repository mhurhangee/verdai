import { useState } from 'react'

import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

import { FeedbackSchema } from '@/types/feedback'

import { toast } from 'sonner'

interface FeedbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    // Validate client-side
    const parsed = FeedbackSchema.safeParse({ message, page: pathname })
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || 'Invalid feedback')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, page: pathname }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Thank you for your feedback!')
        setMessage('')
        onOpenChange(false)
      } else {
        setError(data.message || 'Failed to send feedback')
        toast.error(data.message || 'Failed to send feedback')
      }
    } catch {
      setError('Something went wrong')
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Let us know what you think, or if you've found a bug."
            minLength={3}
            maxLength={2048}
            required
            className="min-h-[100px] resize-none"
            autoFocus
          />
          {error && <div className="text-xs text-red-500">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading || !message.trim()}>
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
