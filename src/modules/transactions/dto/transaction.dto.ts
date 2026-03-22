import type z from 'zod'
import type {
  categorySchema,
  paymentMethodSchema,
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
export type ICategoryTransactionType = z.infer<typeof categorySchema>
export type IPaymentMethodTransactionType = z.infer<typeof paymentMethodSchema>
