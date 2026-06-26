import { decimal, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { categoryEnum, paymentMethodEnum, transactionTypeEnum } from './enums'
import { usersTable } from './users'
import { workspacesTable } from './workspaces'

export const transactionsTable = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspacesTable.id, { onDelete: 'cascade' }),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar('name').notNull(),
  description: varchar('description'),
  type: transactionTypeEnum('type').notNull(),
  category: categoryEnum('category').notNull(),
  amount: decimal({ precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp('payment_date').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
