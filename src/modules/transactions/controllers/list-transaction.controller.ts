import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { paginatedResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  listTransactionParamsSchema,
  listTransactionQuerySchema,
} from '../schemas/list-transaction.schema'
import type { ListTransactionService } from '../services/list-transaction.service'

export class ListTransactionController {
  constructor(private listTransactionService: ListTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params, query } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = listTransactionParamsSchema.safeParse(params)
    if (!successParams)
      throw new AppError(getValidationMessage(errorParams), 400)

    const {
      success: successQuery,
      data: dataQuery,
      error: errorQuery,
    } = listTransactionQuerySchema.safeParse(query)
    if (!successQuery) throw new AppError(getValidationMessage(errorQuery), 400)

    const { page, limit } = dataQuery
    const { workspaceId } = dataParams

    const transactions = await this.listTransactionService.listAll({
      workspaceId,
      page,
      limit,
    })

    return reply.status(200).send(paginatedResponse(transactions))
  }
}
