import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { userProfileEnum } from './enums'

export const usersTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique().notNull(),
  passwordHashed: varchar('password_hashed').notNull(),
  financialProfile: userProfileEnum('financial_profile'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
})
