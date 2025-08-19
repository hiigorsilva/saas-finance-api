import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import {
  editTransactionBodySchema,
  editTransactionParamsSchema,
} from '../schemas/edit-transaction.schema'
import type { EditTransactionService } from '../services/edit-transaction.service'

export class EditTransactionController {
  constructor(private editTransactionService: EditTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, body, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const {
        success: successParams,
        data: dataParams,
        error: errorParams,
      } = editTransactionParamsSchema.safeParse(params)
      if (!successParams) return badRequest({ error: errorParams.issues })

      const { success, data, error } = editTransactionBodySchema.safeParse(body)
      if (!success) return badRequest({ error: error.issues })

      const { workspaceId, transactionId } = dataParams

      const transaction = await this.editTransactionService.editTransaction({
        workspaceId,
        transactionId,
        data,
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
