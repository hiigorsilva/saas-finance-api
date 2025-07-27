import {
  date,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { usersTable } from './users'
import { workspacesTable } from './workspaces'

export const TRANSACTION_TYPES = pgEnum('transaction_types', [
  'INCOME',
  'EXPENSE',
  'INVESTIMENT',
])
const PAYMENT_METHOD = pgEnum('payment_method', [
  'PIX',
  'CARD',
  'CASH',
  'BANK_SLIP',
  'TRANSFERENCE',
  'OTHER',
])

export const transactionsTable = pgTable('transactions', {
  id: uuid().primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspacesTable.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }).notNull(),
  type: TRANSACTION_TYPES().notNull().default('EXPENSE'),
  category: varchar({ length: 255 }).notNull(),
  amount: numeric({ precision: 10, scale: 2 }).notNull(),
  paymentDate: date('payment_date').notNull().defaultNow(),
  paymentMethod: PAYMENT_METHOD('payment_method').default('CARD'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
