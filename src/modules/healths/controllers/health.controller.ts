import type { FastifyReply } from 'fastify'
import { dataResponse } from '../../../shared/utils/http'

export class HealthController {
  async handle(reply: FastifyReply) {
    return reply.status(200).send(dataResponse({ status: 'Ok' }))
  }
}
