import type z from 'zod'
import type {
  categorySchema,
  recurringIntervalSchema,
  typeSchema,
} from '../../data/transactions'

type TypeTransaction = z.infer<typeof typeSchema>
type RecurringIntervalTransaction = z.infer<typeof recurringIntervalSchema>
type CategoryTransaction = z.infer<typeof categorySchema>

export interface ITransaction {
  id: string
  workspaceId: string
  createdByUserId: string
  name: string
  description: string | null
  type: TypeTransaction
  category: CategoryTransaction
  amount: string
  paymentDate: Date
  isRecurring: boolean
  recurringInterval: RecurringIntervalTransaction | null
  recurringEndDate: Date | null
  installmentTotal: number | null
  currentInstallment: number | null
  createdAt: Date
  updatedAt: Date
}

export type IPaginatedTransaction = {
  transactions: ITransaction[]
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
}

export type ITransactionId = Pick<ITransaction, 'id'>

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

export type ResponseTransactionDto = {
  id: string
  name: string
  amount: string
  paymentDate: Date
}

export interface ITransactionRepository {
  alreadyExistsById(
    userId: string,
    workspaceId: string,
    transactionId: string
  ): Promise<boolean>

  create(
    workspaceID: string,
    userId: string,
    data: CreateTransactionDto
  ): Promise<ITransactionId>

  list(
    userId: string,
    workspaceId: string,
    page?: number,
    limit?: number
  ): Promise<IPaginatedTransaction>

  findTransactionById(
    userId: string,
    workspaceId: string,
    transactionId: string
  ): Promise<ITransaction | null>

  delete(
    userId: string,
    workspaceId: string,
    transactionId: string
  ): Promise<{ status: string }>

  update(
    userId: string,
    workspaceId: string,
    transactionId: string,
    data: CreateTransactionDto
  ): Promise<ResponseTransactionDto>
}
