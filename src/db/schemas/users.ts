import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { userProfileEnum } from './enums'

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique().notNull(),
  passwordHashed: text('password_hashed').notNull(),
  financialProfile: userProfileEnum('financial_profile'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
