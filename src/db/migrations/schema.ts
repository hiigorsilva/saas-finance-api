import {
  boolean,
  foreignKey,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const category = pgEnum('category', [
  'HOUSING',
  'PERSONAL_CARE',
  'TRANSPORTATION',
  'FOOD',
  'GROCERIES',
  'ENTERTAINMENT',
  'FAMILY',
  'WORK',
  'HEALTH',
  'GIFTS',
  'SALARY',
  'INVESTMENT',
  'OTHER',
])
export const financialProfile = pgEnum('financial_profile', [
  'DEBTOR',
  'SPENDER',
  'DETACHED',
  'SAVER',
  'INVESTOR',
])
export const paymentMethod = pgEnum('payment_method', [
  'CREDIT_CARD',
  'DEBIT_CARD',
  'BOLETO',
  'PIX',
  'CASH',
  'OTHERS',
])
export const recurringInterval = pgEnum('recurring_interval', [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
])
export const roleMemberWorkspace = pgEnum('role_member_workspace', [
  'OWNER',
  'ADMIN',
  'MEMBER',
  'VIEWER',
])
export const status = pgEnum('status', ['PENDING', 'ACCEPTED', 'DECLINED'])
export const transactionType = pgEnum('transaction_type', [
  'INCOME',
  'EXPENSE',
  'INVESTMENT',
])
export const typeWorkspace = pgEnum('type_workspace', ['PRIVATE', 'SHARED'])

export const workspaces = pgTable(
  'workspaces',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    description: text(),
    ownerId: uuid('owner_id').notNull(),
    type: typeWorkspace().notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.ownerId],
      foreignColumns: [users.id],
      name: 'workspaces_owner_id_users_id_fk',
    }).onDelete('cascade'),
  ]
)

export const transactions = pgTable(
  'transactions',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    workspaceId: uuid('workspace_id').notNull(),
    createdByUserId: uuid('created_by_user_id').notNull(),
    name: text().notNull(),
    description: text(),
    type: transactionType().notNull(),
    category: category().notNull(),
    amount: numeric({ precision: 10, scale: 2 }).notNull(),
    paymentDate: timestamp('payment_date', { mode: 'string' }).notNull(),
    isRecurring: boolean('is_recurring').default(false).notNull(),
    recurringInterval: recurringInterval('recurring_interval'),
    recurringEndDate: timestamp('recurring_end_date', { mode: 'string' }),
    totalInstallments: integer('total_installments'),
    currentInstallment: integer('current_installment'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: 'transactions_workspace_id_workspaces_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.createdByUserId],
      foreignColumns: [users.id],
      name: 'transactions_created_by_user_id_users_id_fk',
    }).onDelete('cascade'),
  ]
)

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    name: text().notNull(),
    email: text().notNull(),
    passwordHashed: text('password_hashed').notNull(),
    financialProfile: financialProfile('financial_profile'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    deletedAt: timestamp('deleted_at', { mode: 'string' }),
  },
  table => [unique('users_email_unique').on(table.email)]
)

export const workspaceInvitations = pgTable(
  'workspace_invitations',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    workspaceId: uuid('workspace_id').notNull(),
    inviterId: uuid('inviter_id').notNull(),
    inviteeId: uuid('invitee_id').notNull(),
    status: status().default('PENDING'),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    expiresAt: timestamp('expires_at', { mode: 'string' }),
    acceptedAt: timestamp('accepted_at', { mode: 'string' }),
    declinedAt: timestamp('declined_at', { mode: 'string' }),
  },
  table => [
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: 'workspace_invitations_workspace_id_workspaces_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.inviterId],
      foreignColumns: [users.id],
      name: 'workspace_invitations_inviter_id_users_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.inviteeId],
      foreignColumns: [users.id],
      name: 'workspace_invitations_invitee_id_users_id_fk',
    }).onDelete('cascade'),
  ]
)

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    workspaceId: uuid('workspace_id').notNull(),
    userId: uuid('user_id').notNull(),
    role: roleMemberWorkspace().notNull(),
    joinedAt: timestamp('joined_at', { mode: 'string' }).defaultNow().notNull(),
  },
  table => [
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: 'workspace_members_workspace_id_workspaces_id_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'workspace_members_user_id_users_id_fk',
    }).onDelete('cascade'),
  ]
)
