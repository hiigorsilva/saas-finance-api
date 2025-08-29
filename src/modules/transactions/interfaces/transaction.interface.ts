import type { IPaginationOutput } from '../../../shared/types/response'
import type {
  ICategoryTransactionType,
  ICreateTransactionDTO,
  IEditTransactionDTO,
  IRecurringIntervalTransactionType,
  ITransactionDTO,
  ITransactionId,
  ITransactionType,
} from '../dto/transaction.dto'

export interface ITransaction {
  id: string
  workspaceId: string
  createdByUserId: string
  name: string
  description: string | null
  type: ITransactionType
  category: ICategoryTransactionType
  amount: string
  paymentDate: Date
  isRecurring: boolean
  recurringInterval: IRecurringIntervalTransactionType | null
  recurringEndDate: Date | null
  installmentTotal: number | null
  currentInstallment: number | null
  createdAt: Date
  updatedAt: Date
}

export interface ITransactionRepository {
  alreadyExistsById(
    workspaceId: string,
    transactionId: string
  ): Promise<boolean>

  list(
    workspaceId: string,
    page?: number,
    limit?: number
  ): Promise<IPaginationOutput<ITransaction>>

  findTransactionById(
    workspaceId: string,
    transactionId: string
  ): Promise<ITransaction | null>

  save(
    workspaceId: string,
    userId: string,
    data: ICreateTransactionDTO
  ): Promise<ITransactionId>

  edit(
    workspaceId: string,
    transactionId: string,
    data: IEditTransactionDTO
  ): Promise<ITransactionDTO>

  remove(
    userId: string,
    workspaceId: string,
    transactionId: string
  ): Promise<{ status: string }>
}
