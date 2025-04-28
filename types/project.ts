import { z } from 'zod'

export const ProjectSchema = z.object({
  id: z.string().length(12),
  userId: z.string().max(255),
  title: z.string().min(3).max(52),
  description: z.string().max(512).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type Project = z.infer<typeof ProjectSchema>

export const ProjectUpdateSchema = ProjectSchema.pick({
  title: true,
  description: true,
  updatedAt: true,
});

export type ProjectUpdate = z.infer<typeof ProjectUpdateSchema>