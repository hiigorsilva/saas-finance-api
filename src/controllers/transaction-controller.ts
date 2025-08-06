import type { FastifyRequest } from 'fastify'
import {
  createTransactionBodySchema,
  createTransactionParamsSchema,
} from '../schemas/transactions/create-transaction'
import { deleteTransactionParamsResponseSchema } from '../schemas/transactions/delete-transaction'
import { listTransactionParamsSchema } from '../schemas/transactions/list-transaction'
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
    return created({ transaction })
  }

  async list(request: FastifyRequest) {
    const { userId, params } = request
    if (!userId) return unauthorized({ error: 'Unauthorized.' })

    const { success, data, error } =
      listTransactionParamsSchema.safeParse(params)
    if (!success) return badRequest({ error: error.message })

    const transactions = await this.transactionService.list(
      userId,
      data.workspaceId
    )
    return ok({ transactions })
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
}
