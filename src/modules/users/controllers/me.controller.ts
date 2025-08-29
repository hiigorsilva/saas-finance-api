import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  badRequest,
  internalServerError,
  ok,
  unauthorized,
} from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'
import type { MeService } from '../services/me.service'

export class MeController {
  constructor(private meService: MeService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { userId } = request
      if (!userId) return unauthorized({ error: 'Unauthorized.' })

      const user = await this.meService.getUserData(userId)
      const response = ok({ data: user })

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
