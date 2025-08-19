import { and, count, desc, eq, isNull } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { transactionsTable } from '../../../db/schemas/transactions'
import type { IPaginationOutput } from '../../../shared/types/response'
import type {
  ICreateTransactionDTO,
  IEditTransactionDTO,
  ITransactionDTO,
  ITransactionId,
} from '../dto/transaction.dto'
import type {
  ITransaction,
  ITransactionRepository,
} from '../interfaces/transaction.interface'

export class TransactionRepository implements ITransactionRepository {
  async alreadyExistsById(
    workspaceId: string,
    transactionId: string
  ): Promise<boolean> {
    const transaction = await db.query.transactionsTable.findFirst({
      where: and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.workspaceId, workspaceId)
      ),
    })
    return !!transaction
  }

  async list(
    workspaceId: string,
    page = 1,
    limit = 10
  ): Promise<IPaginationOutput<ITransaction>> {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, Math.min(limit, 100))
    const offset = (safePage - 1) * safeLimit

    const [totalCount, transactions] = await Promise.all([
      db
        .select({ count: count() })
        .from(transactionsTable)
        .where(
          and(
            eq(transactionsTable.workspaceId, workspaceId),
            isNull(transactionsTable.deletedAt)
          )
        )
        .then(row => Number(row[0].count ?? 0)),

      db.query.transactionsTable.findMany({
        columns: {
          deletedAt: false,
        },
        where: and(
          eq(transactionsTable.workspaceId, workspaceId),
          isNull(transactionsTable.deletedAt)
        ),
        limit: safeLimit,
        offset: offset,
        orderBy: desc(transactionsTable.paymentDate),
      }),
    ])

    const totalPages = Math.ceil(totalCount / safeLimit)
    const safeTotalPages = Math.max(1, totalPages)
    if (safePage > safeTotalPages) {
      throw new Error('Page out of range. Please enter a valid page.')
    }

    return {
      data: transactions,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: safePage,
      limit: safeLimit,
    }
  }

  async findTransactionById(
    workspaceId: string,
    transactionId: string
  ): Promise<ITransaction | null> {
    const transaction = await db.query.transactionsTable.findFirst({
      columns: {
        deletedAt: false,
      },
      where: and(
        eq(transactionsTable.workspaceId, workspaceId),
        eq(transactionsTable.id, transactionId),
        isNull(transactionsTable.deletedAt)
      ),
    })
    return transaction ?? null
  }

  async save(
    workspaceId: string,
    userId: string,
    data: ICreateTransactionDTO
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

  async edit(
    workspaceId: string,
    transactionId: string,
    data: IEditTransactionDTO
  ): Promise<ITransactionDTO> {
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

  async remove(
    workspaceId: string,
    transactionId: string
  ): Promise<{ status: string }> {
    await db
      .delete(transactionsTable)
      .where(
        and(
          eq(transactionsTable.workspaceId, workspaceId),
          eq(transactionsTable.id, transactionId)
        )
      )
    return { status: 'Transaction deleted successfully.' }
  }
}
