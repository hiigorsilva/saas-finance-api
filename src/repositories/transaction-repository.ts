import { and, count, eq, isNull } from 'drizzle-orm'
import { db } from '../db/connection'
import { transactionsTable } from '../db/schemas/transactions'
import type {
  CreateTransactionDto,
  IPaginatedTransaction,
  ITransaction,
  ITransactionId,
  ITransactionRepository,
  ResponseTransactionDto,
} from '../interfaces/transactions/transaction'

export class TransactionRepository implements ITransactionRepository {
  async alreadyExistsById(
    userId: string,
    workspaceId: string,
    transactionId: string
  ): Promise<boolean> {
    const transaction = await db.query.transactionsTable.findFirst({
      where: and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.workspaceId, workspaceId),
        eq(transactionsTable.createdByUserId, userId)
      ),
    })
    return !!transaction
  }

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

  async list(
    userId: string,
    workspaceId: string,
    page = 1,
    limit = 10
  ): Promise<IPaginatedTransaction> {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, Math.min(limit, 100))
    const offset = (safePage - 1) * safeLimit

    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(transactionsTable)
      .where(
        and(
          eq(transactionsTable.createdByUserId, userId),
          eq(transactionsTable.workspaceId, workspaceId),
          isNull(transactionsTable.deletedAt)
        )
      )

    const transactions = await db.query.transactionsTable.findMany({
      columns: {
        deletedAt: false,
      },
      where: and(
        eq(transactionsTable.createdByUserId, userId),
        eq(transactionsTable.workspaceId, workspaceId),
        isNull(transactionsTable.deletedAt)
      ),
      limit: safeLimit,
      offset: offset,
    })

    return {
      transactions: transactions,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / safeLimit),
      currentPage: safePage,
      limit: safeLimit,
    }
  }

  async findTransactionById(
    userId: string,
    workspaceId: string,
    transactionId: string
  ): Promise<ITransaction | null> {
    const transaction = await db.query.transactionsTable.findFirst({
      columns: {
        deletedAt: false,
      },
      where: and(
        eq(transactionsTable.createdByUserId, userId),
        eq(transactionsTable.workspaceId, workspaceId),
        eq(transactionsTable.id, transactionId),
        isNull(transactionsTable.deletedAt)
      ),
    })
    return transaction ?? null
  }

  async delete(
    userId: string,
    workspaceId: string,
    transactionId: string
  ): Promise<{ status: string }> {
    await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.createdByUserId, userId),
          eq(transactionsTable.workspaceId, workspaceId),
          eq(transactionsTable.id, transactionId)
        )
      )
    return { status: 'Transaction deleted successfully.' }
  }

  async update(
    userId: string,
    workspaceId: string,
    transactionId: string,
    data: CreateTransactionDto
  ): Promise<ResponseTransactionDto> {
    const [transaction] = await db
      .update(transactionsTable)
      .set({
        name: data.name,
        description: data.description,
        type: data.type,
        category: data.category,
        amount: data.amount,
        paymentDate: data.paymentDate,
        isRecurring: data.isRecurring,
        recurringEndDate: data.recurringEndDate,
        recurringInterval: data.recurringInterval,
        currentInstallment: data.currentInstallment,
        installmentTotal: data.installmentTotal,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transactionsTable.id, transactionId),
          eq(transactionsTable.workspaceId, workspaceId),
          eq(transactionsTable.createdByUserId, userId),
          isNull(transactionsTable.deletedAt)
        )
      )
      .returning({
        id: transactionsTable.id,
        name: transactionsTable.name,
        amount: transactionsTable.amount,
        paymentDate: transactionsTable.paymentDate,
      })
    return transaction
  }
}
