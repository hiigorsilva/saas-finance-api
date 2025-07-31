import type { FastifyInstance } from 'fastify'
import { SignInController } from '../../controllers/signin-controller'
import { UserRepository } from '../../repositories/user-repository'
import * as schema from '../../schemas/signin-schema'
import { SignInService } from '../../services/signin-service'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

const userRepository = new UserRepository()
const signinService = new SignInService(userRepository)
const signinController = new SignInController(signinService)

export const signinRoute = (app: FastifyInstance) => {
  app.post('/signin', schema.signin, async (request, reply) => {
    try {
      const response = await signinController.handle(request)
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
