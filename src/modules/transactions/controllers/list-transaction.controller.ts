import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import {
  listTransactionParamsSchema,
  listTransactionQuerySchema,
} from '../schemas/list-transaction.schema'
import type { ListTransactionService } from '../services/list-transaction.service'

export class ListTransactionController {
  constructor(private listTransactionService: ListTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params, query } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const {
        success: successParams,
        data: dataParams,
        error: errorParams,
      } = listTransactionParamsSchema.safeParse(params)
      if (!successParams) return badRequest({ error: errorParams.issues })

      const {
        success: successQuery,
        data: dataQuery,
        error: errorQuery,
      } = listTransactionQuerySchema.safeParse(query)
      if (!successQuery) return badRequest({ error: errorQuery.issues })

      const { page, limit } = dataQuery
      const { workspaceId } = dataParams

      const transactions = await this.listTransactionService.listAll({
        workspaceId,
        page,
        limit,
      })
      const response = ok({ ...transactions })

      return reply.status(response.statusCode).send(response)
    } catch (error) {
      if (error instanceof Error) {
        return reply
          .status(400)
          .send(parseResponse(badRequest({ error: error.message })))
      }
      return reply
        .status(500)
        .send(
          parseResponse(internalServerError({ error: 'Internal server error' }))
        )
    }
  }
}
