import { and, count, desc, eq, isNull, sql } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { transactionsTable } from '../../../db/schemas/transactions'
import { AppError, ErrorCodes } from '../../../errors/app-error'
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
    limit = 10,
    search?: string
  ): Promise<IPaginationOutput<ITransaction>> {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, Math.min(limit, 100))
    const offset = (safePage - 1) * safeLimit

    const normalizedSearch = search?.trim()
    const hasSearch = !!normalizedSearch

    const baseWhere = and(
      eq(transactionsTable.workspaceId, workspaceId),
      isNull(transactionsTable.deletedAt)
    )

    const ftsWhere = hasSearch
      ? sql<boolean>`to_tsvector(
            'simple',
            concat_ws(
              ' ',
              coalesce(${transactionsTable.name}, ''),
              coalesce(${transactionsTable.description}, ''),
              coalesce(cast(${transactionsTable.category} as text), ''),
              coalesce(cast(${transactionsTable.type} as text), ''),
              coalesce(cast(${transactionsTable.paymentMethod} as text), '')
            )
          ) @@ websearch_to_tsquery('simple', ${normalizedSearch})`
      : undefined

    const whereClause = ftsWhere ? and(baseWhere, ftsWhere) : baseWhere

    const [totalCount, transactions] = await Promise.all([
      db
        .select({ count: count() })
        .from(transactionsTable)
        .where(whereClause)
        .then(row => Number(row[0].count ?? 0)),

      db.query.transactionsTable.findMany({
        columns: {
          deletedAt: false,
        },
        where: whereClause,
        limit: safeLimit,
        offset: offset,
        orderBy: desc(transactionsTable.paymentDate),
      }),
    ])

    const totalPages = Math.ceil(totalCount / safeLimit)
    const safeTotalPages = Math.max(1, totalPages)
    if (safePage > safeTotalPages) {
      throw new AppError(
        'Page out of range. Please enter a valid page.',
        400,
        ErrorCodes.PAGE_OUT_OF_RANGE
      )
    }

    return {
      data: transactions,
      totalCount: totalCount,
      totalPages: safeTotalPages,
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
        ownerId: userId,
        name: data.name,
        description: data.description,
        type: data.type,
        amount: data.amount,
        category: data.category,
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
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
        paymentMethod: data.paymentMethod,
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
        paymentMethod: transactionsTable.paymentMethod,
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
