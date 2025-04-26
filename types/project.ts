import { z } from 'zod'

export interface Project {
  projectId: string // changed from number to string for consistency with DB schema
  userId: string
  projectName: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProjectUpdate {
  projectName?: string
  description?: string
  prompt?: string
  updatedAt: Date
}

export const ProjectPatchSchema = z.object({
  projectName: z.string().optional(),
  emoji: z.string().optional(),
  description: z.string().optional(),
  prompt: z.string().optional(),
})

export const ProjectPostSchema = z.object({
  projectName: z.string().min(3),
  emoji: z.string().optional(),
  description: z.string().optional(),
  prompt: z.string().optional(),
})