import { pgEnum, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core'
import { usersTable } from './users'
import { workspacesTable } from './workspaces'

const ROLE_TYPES = pgEnum('role_types', ['ADMIN', 'MEMBER'])

export const workspacesUsers = pgTable(
  'workspaces_users',
  {
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspacesTable.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => usersTable.id, { onDelete: 'cascade' }),
    role: ROLE_TYPES('role').notNull().default('MEMBER'),
  },
  table => ({
    pk: primaryKey({ columns: [table.workspaceId, table.userId] }),
  })
)
