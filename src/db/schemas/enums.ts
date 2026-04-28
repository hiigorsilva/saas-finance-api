import { pgEnum } from 'drizzle-orm/pg-core'

export const userProfileEnum = pgEnum('financial_profile', [
  'DEBTOR',
  'SPENDER',
  'DETACHED',
  'SAVER',
  'INVESTOR',
])

export const roleMemberWorkspaceEnum = pgEnum('role_member_workspace', [
  'OWNER',
  'ADMIN',
  'MEMBER',
  'VIEWER',
])

export const typeWorkspaceEnum = pgEnum('type_workspace', ['PRIVATE', 'SHARED'])

export const transactionTypeEnum = pgEnum('transaction_type', [
  'INCOME',
  'EXPENSE',
  'INVESTMENT',
])

export const transactionStatusEnum = pgEnum('transaction_status', [
  'PENDING',
  'PAID',
])

export const paymentMethodEnum = pgEnum('payment_method', [
  'CREDIT_CARD',
  'DEBIT_CARD',
  'BANK_SLIP',
  'PIX',
  'CASH',
  'OTHER',
])

export const statusWorkspaceInvitation = pgEnum('status', [
  'PENDING',
  'ACCEPTED',
  'DECLINED',
])

export const categoryEnum = pgEnum('category', [
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
