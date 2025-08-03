import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { roleMemberWorkspaceEnum } from './enums'
import { usersTable } from './users'
import { workspacesTable } from './workspaces'

export const workspaceMembersTable = pgTable(
  'workspace_members',
  {
    workspaceId: uuid('workspace_id').references(() => workspacesTable.id),
    userId: uuid('user_id').references(() => usersTable.id),
    role: roleMemberWorkspaceEnum('role').notNull(),
    joinedAt: timestamp('joined_at').defaultNow(),
    // PK composta
  },
  table => ({
    pk: [table.workspaceId, table.userId],
  })
)
