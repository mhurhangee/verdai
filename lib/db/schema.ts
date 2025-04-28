import { pgTable, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const userProjects = pgTable('user_projects', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  projectName: varchar('project_name', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const libraryItems = pgTable('library_items', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  projectId: varchar('project_id', { length: 255 }),
  url: varchar('url', { length: 255 }),
  type: varchar('type', { length: 50 }).notNull(), // e.g., 'chat', 'file', 'email', 'docs', 'spreadsheet'
  title: varchar('title', { length: 255 }),
  content: jsonb('content'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
