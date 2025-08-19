import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  created,
  internalServerError,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import {
  createTransactionBodySchema,
  createTransactionParamsSchema,
} from '../schemas/create-transaction.schema'
import type { CreateTransactionService } from '../services/create-transaction.service'

export class CreateTransactionController {
  constructor(private createTransactionService: CreateTransactionService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId, body, params } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const { success, data, error } =
        createTransactionBodySchema.safeParse(body)
      if (!success) return badRequest({ error: error.issues })

      const {
        success: successParams,
        data: dataParams,
        error: errorParams,
      } = createTransactionParamsSchema.safeParse(params)
      if (!successParams) return badRequest({ error: errorParams.issues })

      const { workspaceId } = dataParams

      const transaction = await this.createTransactionService.create({
        workspaceId,
        userId,
        data,
      })

      const response = created({ data: transaction })
      return reply.status(response.statusCode).send(parseResponse(response))
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
