import type { FastifyInstance } from 'fastify'
import { GetHealthStatusController } from '../../controllers/health-controller'
import * as schema from '../../schemas/health-schema'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

export const healthRoute = async (app: FastifyInstance) => {
  app.get('/health', schema.health, async (_, reply) => {
    try {
      const response = await GetHealthStatusController.handle()
      return reply.status(200).send(response)
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
  })
}
