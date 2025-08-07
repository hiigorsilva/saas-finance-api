import z from 'zod'

export const typeSchema = z.enum(['INCOME', 'EXPENSE', 'INVESTMENT'])

export const categorySchema = z.enum([
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

export const recurringIntervalSchema = z.enum([
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
])
