import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { usersTable } from './users'

const WORKSPACE_TYPES = pgEnum('workspace_types', ['PERSONAL', 'SHARED'])

export const workspacesTable = pgTable('workspaces', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text(),
  type: WORKSPACE_TYPES().notNull().default('PERSONAL'),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
