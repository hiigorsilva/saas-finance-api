import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { typeWorkspaceEnum } from './enums'
import { usersTable } from './users'

export const workspacesTable = pgTable('workspaces', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: varchar('name').notNull(),
  slug: varchar('slug').unique().notNull(),
  description: varchar('description'),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  type: typeWorkspaceEnum('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
