import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'
import { statusWorkspaceInvitation } from './enums'
import { usersTable } from './users'
import { workspacesTable } from './workspaces'

export const workspaceInvitationsTable = pgTable('workspace_invitations', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspacesTable.id),
  inviterId: uuid('inviter_id')
    .notNull()
    .references(() => usersTable.id),
  inviteeId: uuid('invitee_id')
    .notNull()
    .references(() => usersTable.id),
  status: statusWorkspaceInvitation('status').default('PENDING'),
  createdAt: timestamp('created_at').defaultNow(),
  expiresAt: timestamp('expires_at'),
  acceptedAt: timestamp('accepted_at'),
  declinedAt: timestamp('declined_at'),
})
