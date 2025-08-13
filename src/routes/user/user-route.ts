import type { FastifyInstance } from 'fastify'
import { UserController } from '../../controllers/user-controller'
import { UserRepository } from '../../repositories/user-repository'
import { getDataUser } from '../../schemas/users/get-me-schema'
import { listAllUsersSchema } from '../../schemas/users/list-all-users-schema'
import { UserService } from '../../services/user-service'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

export const userRoute = async (app: FastifyInstance) => {
  app.get('/me', getDataUser, async (request, reply) => {
    try {
      const response = await userController.findUserById(request)
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

  app.get('/users', listAllUsersSchema, async (request, reply) => {
    try {
      const response = await userController.listAllUsers(request)
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
