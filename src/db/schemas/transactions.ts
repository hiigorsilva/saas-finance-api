// transactions.ts
import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { categoriesTable } from './categories'
import { recurringIntervalEnum, transactionTypeEnum } from './enums'
import { usersTable } from './users'
import { workspacesTable } from './workspaces'

export const transactionsTable = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspacesTable.id),
  createdByUserId: uuid('created_by_user_id')
    .notNull()
    .references(() => usersTable.id),
  name: text('name').notNull(),
  description: text('description'),
  type: transactionTypeEnum('type').notNull(),
  categoryId: uuid('category_id').references(() => categoriesTable.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp('payment_date').notNull(),
  isRecurring: text('is_recurring').$type<'true' | 'false'>().default('false'),
  recurringInterval: recurringIntervalEnum('recurring_interval'),
  recurringEndDate: timestamp('recurring_end_date'),
  installmentTotal: integer('total_installments'),
  currentInstallment: integer('current_installment'),
  parentTransactionId: uuid('parent_transaction_id'), // adionar manualmente ao criar transaction
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
