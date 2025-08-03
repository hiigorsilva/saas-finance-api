export type TransactionType = 'INCOME' | 'EXPENSE' | 'INVESTMENT'
export type RecurringInterval = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export interface ITransaction {
  id: string
  workspaceId: string
  createdByUserId: string
  name: string
  description: string | null
  type: TransactionType
  category: string
  amount: string
  paymentDate: Date
  isRecurring: boolean | null
  recurringInterval: RecurringInterval | null
  recurringEndDate: Date | null
  installmentTotal: number | null
  currentInstallment: number | null
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type CreateTransactionDto = {
  name: string
  description?: string | null
  type: TransactionType
  category: string
  amount: string
  paymentDate: Date
  isRecurring?: boolean | null
  recurringInterval?: RecurringInterval | null
  recurringEndDate?: Date | null
  installmentTotal?: number | null
  currentInstallment?: number | null
}

export type ITransactionId = Pick<ITransaction, 'id'>

export interface ITransactionRepository {
  create(
    workspaceID: string,
    userId: string,
    data: CreateTransactionDto
  ): Promise<ITransactionId>
}
