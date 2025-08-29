import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import { removeTransactionParamsSchema } from '../schemas/remove-transaction.schema'
import type { RemoveTransactionService } from '../services/remove-transaction.service'

export class RemoveTransactionController {
  constructor(private removeTransactionService: RemoveTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } =
        removeTransactionParamsSchema.safeParse(params)
      if (!success) return badRequest({ error: error.issues })

      const { workspaceId, transactionId } = data

      const transaction = await this.removeTransactionService.removeTransaction(
        {
          workspaceId,
          transactionId,
          userId,
        }
      )
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
