export type TransactionType = 'INCOME' | 'EXPENSE' | 'INVESTMENT'
export type RecurringInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export interface ITransaction {
  id: string
  workspaceId: string
  createdByUserId: string
  name: string
  description?: string | undefined
  type: TransactionType
  category: string
  amount: string
  paymentDate: Date
  isRecurring: boolean
  recurringInterval?: RecurringInterval | undefined
  recurringEndDate?: Date | undefined
  installmentTotal?: number | undefined
  currentInstallment?: number | undefined
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | undefined
}

export type CreateTransactionDto = {
  name: string
  description?: string | undefined
  type: TransactionType
  category: string
  amount: string
  paymentDate: Date
  isRecurring: boolean
  recurringInterval?: RecurringInterval | undefined
  recurringEndDate?: Date | undefined
  installmentTotal?: number | undefined
  currentInstallment?: number | undefined
}

export type ITransactionId = Pick<ITransaction, 'id'>

export interface ITransactionRepository {
  create(
    workspaceID: string,
    userId: string,
    data: CreateTransactionDto
  ): Promise<ITransactionId>
}
