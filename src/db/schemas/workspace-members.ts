import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { roleMemberWorkspaceEnum } from './enums'
import { usersTable } from './users'
import { workspacesTable } from './workspaces'

export const workspaceMembersTable = pgTable('workspace_members', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  workspaceId: uuid('workspace_id')
    .references(() => workspacesTable.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  role: roleMemberWorkspaceEnum('role').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
})
