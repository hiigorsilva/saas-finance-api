// transactionTags.ts
import { pgTable, uuid } from 'drizzle-orm/pg-core'
import { tagsTable } from './tags'
import { transactionsTable } from './transactions'

export const transactionTags = pgTable(
  'transaction_tags',
  {
    transactionId: uuid('transaction_id')
      .references(() => transactionsTable.id)
      .notNull(),
    tagId: uuid('tag_id')
      .references(() => tagsTable.id)
      .notNull(),

    // PK composta
  },
  table => ({
    pk: [table.transactionId, table.tagId],
  })
)
