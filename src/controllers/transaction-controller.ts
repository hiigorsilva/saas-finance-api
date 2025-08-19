import type { FastifyRequest } from 'fastify'
import { deleteTransactionParamsResponseSchema } from '../schemas/transactions/delete-transaction'
import {
  updateTransactionBodySchema,
  updateTransactionParamsSchema,
} from '../schemas/transactions/update-transaction'
import type { TransactionService } from '../services/transaction-service'
import { badRequest, ok, unauthorized } from '../shared/utils/http'

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

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
