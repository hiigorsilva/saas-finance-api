// workspaces.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usersTable } from './users'

export const workspacesTable = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => usersTable.id),
  type: text('type').$type<'PRIVATE' | 'SHARED'>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
