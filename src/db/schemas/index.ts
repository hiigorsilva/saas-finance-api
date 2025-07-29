import { categoriesTable } from './categories'
import { tagsTable } from './tags'
import { transactionTags } from './transaction-tags'
import { transactionsTable } from './transactions'
import { usersTable } from './users'
import { workspaceInvitationsTable } from './workspace-invitations'
import { workspaceMembersTable } from './workspace-members'
import { workspacesTable } from './workspaces'

export const schema = {
  usersTable,
  workspacesTable,
  workspaceMembersTable,
  workspaceInvitationsTable,
  categoriesTable,
  transactionTags,
  tagsTable,
  transactionsTable,
}
