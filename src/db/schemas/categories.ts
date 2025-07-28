// categories.ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { transactionTypeEnum } from './enums'
import { workspacesTable } from './workspaces'

export const categoriesTable = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').references(() => workspacesTable.id), // se null => global
  name: text('name').notNull(),
  type: transactionTypeEnum('type').notNull(),
  isDefault: text('is_default').$type<'true' | 'false'>().default('false'),
})
