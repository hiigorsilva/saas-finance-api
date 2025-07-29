// workspaceMembers.ts
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { roleEnum } from './enums'
import { usersTable } from './users'
import { workspacesTable } from './workspaces'

export const workspaceMembersTable = pgTable(
  'workspace_members',
  {
    workspaceId: uuid('workspace_id').references(() => workspacesTable.id),
    userId: uuid('user_id').references(() => usersTable.id),
    role: roleEnum('role').notNull(),
    joinedAt: timestamp('joined_at').defaultNow(),

    // PK composta
  },
  table => ({
    pk: [table.workspaceId, table.userId],
  })
)
