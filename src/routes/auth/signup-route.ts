import type { FastifyInstance } from 'fastify'
import { SignUpController } from '../../controllers/signup-controller'
import { UserRepository } from '../../repositories/user-repository'
import { signupSchema } from '../../schemas/auth/signup-schema'
import { SignUpService } from '../../services/signup-service'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

const userRepository = new UserRepository()
const signupService = new SignUpService(userRepository)
const signupController = new SignUpController(signupService)

export const signupRoute = async (app: FastifyInstance) => {
  app.post('/signup', signupSchema, async (request, reply) => {
    try {
      const response = await signupController.handle(request)
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
