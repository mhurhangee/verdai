import { jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const userProjects = pgTable('user_projects', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }),
  tags: text('tags').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const libraryItems = pgTable('library_items', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  projectId: varchar('project_id', { length: 255 }),
  title: varchar('title', { length: 255 }),
  description: varchar('description', { length: 512 }),
  type: varchar('type', { length: 50 }).notNull(),
  content: jsonb('content'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const feedback = pgTable('feedback', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }),
  page: varchar('page', { length: 255 }),
  message: varchar('message', { length: 2048 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
