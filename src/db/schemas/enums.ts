import { pgEnum } from 'drizzle-orm/pg-core'

export const userProfileEnum = pgEnum('financial_profile', [
  'DEBTOR',
  'SPENDER',
  'DETACHED',
  'SAVER',
  'INVESTOR',
])

export const roleEnum = pgEnum('ROLE', ['OWNER', 'ADMIN', 'MEMBER'])

export const transactionTypeEnum = pgEnum('transaction_type', [
  'INCOME',
  'EXPENSE',
  'INVESTMENT',
])

export const recurringIntervalEnum = pgEnum('recurring_interval', [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
])
