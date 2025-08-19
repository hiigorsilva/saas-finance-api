/*
export type CreateTransactionDto = {
  name: string
  description?: string | undefined
  type: TypeTransaction
  category: CategoryTransaction
  amount: string
  paymentDate: Date
  isRecurring: boolean
  recurringInterval?: RecurringIntervalTransaction | undefined
  recurringEndDate?: Date | undefined
  installmentTotal?: number | undefined
  currentInstallment?: number | undefined
}
*/

import type z from 'zod'
import type {
  categorySchema,
  recurringIntervalSchema,
  typeSchema,
} from '../../../data/transactions'
import type { ITransaction } from '../interfaces/transaction.interface'
import type { createTransactionBodySchema } from '../schemas/create-transaction.schema'
import type { editTransactionBodySchema } from '../schemas/edit-transaction.schema'

export type ICreateTransactionDTO = z.infer<typeof createTransactionBodySchema>
export type IEditTransactionDTO = z.infer<typeof editTransactionBodySchema>
export type ITransactionDTO = Pick<
  ITransaction,
  'id' | 'name' | 'amount' | 'paymentDate'
>
export type ITransactionId = Pick<ITransaction, 'id'>
export type ITransactionType = z.infer<typeof typeSchema>
export type IRecurringIntervalTransactionType = z.infer<
  typeof recurringIntervalSchema
>
export type ICategoryTransactionType = z.infer<typeof categorySchema>
