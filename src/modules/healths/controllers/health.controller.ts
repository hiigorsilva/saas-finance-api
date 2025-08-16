import type { FastifyReply } from 'fastify'
import { badRequest, internalServerError, ok } from '../../../shared/utils/http'
import { parseResponse } from '../../../shared/utils/parse-response'

export class HealthController {
  async handle(reply: FastifyReply) {
    try {
      const response = ok({ status: 'Ok' })
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
