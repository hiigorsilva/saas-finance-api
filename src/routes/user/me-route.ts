import type { FastifyInstance } from 'fastify'
import { MeController } from '../../controllers/me-controller'
import { UserRepository } from '../../repositories/user-repository'
import * as schema from '../../schemas/me-schema'
import { UserService } from '../../services/user-service'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

const userRepository = new UserRepository()
const meService = new UserService(userRepository)
const meController = new MeController(meService)

export const meRoute = async (app: FastifyInstance) => {
  app.get('/me', schema.me, async (request, reply) => {
    try {
      const response = await meController.handle(request)
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
  })
}
