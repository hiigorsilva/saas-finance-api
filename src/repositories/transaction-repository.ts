import { db } from '../db/connection'
import { transactionsTable } from '../db/schemas/transactions'
import type {
  CreateTransactionDto,
  ITransactionId,
  ITransactionRepository,
} from '../interfaces/transactions/create-transaction'

export class TransactionRepository implements ITransactionRepository {
  async create(
    workspaceId: string,
    userId: string,
    data: CreateTransactionDto
  ): Promise<ITransactionId> {
    const [transaction] = await db
      .insert(transactionsTable)
      .values({
        workspaceId: workspaceId,
        createdByUserId: userId,
        name: data.name,
        description: data.description,
        type: data.type,
        amount: data.amount,
        category: data.category,
        paymentDate: data.paymentDate,
        isRecurring: data.isRecurring,
        recurringInterval: data.recurringInterval,
        recurringEndDate: data.recurringEndDate,
        installmentTotal: data.installmentTotal,
        currentInstallment: data.currentInstallment,
      })
      .returning({
        id: transactionsTable.id,
      })

    return transaction
  }
}
