import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { getTransactionByIdParamsSchema } from '../schemas/get-transaction-by-id.schema'
import type { GetTransactionService } from '../services/get-transaction.service'

export class GetTransactionController {
  constructor(private getTransactionService: GetTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } =
        getTransactionByIdParamsSchema.safeParse(params)
      if (!success) return badRequest({ error: error.issues })

      const { workspaceId, transactionId } = data

      const transaction = await this.getTransactionService.getTransactionById({
        workspaceId,
        transactionId,
      })
      const response = ok({ data: transaction })

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
