// tags.ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { workspacesTable } from './workspaces'

export const tagsTable = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').references(() => workspacesTable.id), // se null => global
  name: text('name').notNull(),
})
