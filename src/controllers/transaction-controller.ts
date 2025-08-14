import type { FastifyRequest } from 'fastify'
import {
  createTransactionBodySchema,
  createTransactionParamsSchema,
} from '../schemas/transactions/create-transaction'
import { deleteTransactionParamsResponseSchema } from '../schemas/transactions/delete-transaction'
import { findTransactionByIdParamsSchema } from '../schemas/transactions/find-by-id-transaction'
import {
  listTransactionParamsSchema,
  listTransactionQuerySchema,
} from '../schemas/transactions/list-transaction'
import {
  updateTransactionBodySchema,
  updateTransactionParamsSchema,
} from '../schemas/transactions/update-transaction'
import type { TransactionService } from '../services/transaction-service'
import { badRequest, created, ok, unauthorized } from '../shared/utils/http'

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async create(request: FastifyRequest) {
    const { body, userId, params } = request
    if (!userId) return unauthorized({ error: 'Unauthorized.' })

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = createTransactionParamsSchema.safeParse(params)
    if (!successParams) return badRequest({ error: errorParams.message })

    const { success, data, error } = createTransactionBodySchema.safeParse(body)
    if (!success) return badRequest({ error: error.flatten().fieldErrors })

    const transaction = await this.transactionService.create(
      dataParams.workspaceId,
      userId,
      data
    )
    return created({ data: transaction })
  }

  async list(request: FastifyRequest) {
    const { userId, params, query } = request
    if (!userId) return unauthorized({ error: 'Unauthorized.' })

    const { success, data, error } =
      listTransactionParamsSchema.safeParse(params)
    if (!success) return badRequest({ error: error.message })

    const {
      success: successQuery,
      data: dataQuery,
      error: errorQuery,
    } = listTransactionQuerySchema.safeParse(query)
    if (!successQuery) return badRequest({ error: errorQuery.message })

    const transactions = await this.transactionService.list(
      userId,
      data.workspaceId,
      dataQuery.page,
      dataQuery.limit
    )
    return ok({
      data: transactions.transactions,
      totalCount: transactions.totalCount,
      totalPages: transactions.totalPages,
      currentPage: transactions.currentPage,
      limit: transactions.limit,
    })
  }

  async findTransactionById(request: FastifyRequest) {
    const { userId, params } = request
    if (!userId) return unauthorized({ error: 'Unauthorized.' })

    const { success, data, error } =
      findTransactionByIdParamsSchema.safeParse(params)
    if (!success) return badRequest({ error: error.message })

    const transaction = await this.transactionService.findTransactionById(
      userId,
      data.workspaceId,
      data.transactionId
    )

    return ok({ data: transaction })
  }

  async delete(request: FastifyRequest) {
    const { userId, params } = request
    if (!userId) return unauthorized({ error: 'Unauthorized.' })

    const { success, data, error } =
      deleteTransactionParamsResponseSchema.safeParse(params)
    if (!success) return badRequest({ error: error.message })

    const transaction = await this.transactionService.delete(
      userId,
      data.workspaceId,
      data.transactionId
    )

    return ok({ status: transaction })
  }

  async update(request: FastifyRequest) {
    const { userId, body, params } = request

    if (!userId) return unauthorized({ error: 'Unauthorized.' })

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = updateTransactionParamsSchema.safeParse(params)
    if (!successParams) return badRequest({ error: errorParams.message })

    const { success, data, error } = updateTransactionBodySchema.safeParse(body)
    if (!success) return badRequest({ error: error.message })

    const transaction = await this.transactionService.update(
      userId,
      dataParams.workspaceId,
      dataParams.transactionId,
      data
    )

    return ok({ data: transaction })
  }
}
