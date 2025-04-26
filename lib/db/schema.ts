import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'

export const userProjects = pgTable('user_projects', {
    projectId: varchar('project_id', { length: 12 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    projectName: varchar('project_name', { length: 255 }).notNull(),
    description: varchar('description', { length: 512 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  })