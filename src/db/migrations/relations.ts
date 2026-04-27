import { relations } from 'drizzle-orm/relations'
import {
  transactions,
  users,
  workspaceInvitations,
  workspaceMembers,
  workspaces,
} from './schema'

export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  user: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  transactions: many(transactions),
  workspaceInvitations: many(workspaceInvitations),
  workspaceMembers: many(workspaceMembers),
}))

export const usersRelations = relations(users, ({ many }) => ({
  workspaces: many(workspaces),
  transactions: many(transactions),
  workspaceInvitations_inviterId: many(workspaceInvitations, {
    relationName: 'workspaceInvitations_inviterId_users_id',
  }),
  workspaceInvitations_inviteeId: many(workspaceInvitations, {
    relationName: 'workspaceInvitations_inviteeId_users_id',
  }),
  workspaceMembers: many(workspaceMembers),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [transactions.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [transactions.createdByUserId],
    references: [users.id],
  }),
}))

export const workspaceInvitationsRelations = relations(
  workspaceInvitations,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceInvitations.workspaceId],
      references: [workspaces.id],
    }),
    user_inviterId: one(users, {
      fields: [workspaceInvitations.inviterId],
      references: [users.id],
      relationName: 'workspaceInvitations_inviterId_users_id',
    }),
    user_inviteeId: one(users, {
      fields: [workspaceInvitations.inviteeId],
      references: [users.id],
      relationName: 'workspaceInvitations_inviteeId_users_id',
    }),
  })
)

export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
    }),
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
    }),
  })
)
