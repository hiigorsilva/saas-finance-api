import type { FastifyInstance } from 'fastify'
import { removeUserController } from '../instances/remove-user.instance'
import { removeUserSchema } from '../schemas/remove-user.schema'

export const removeUserRoute = async (app: FastifyInstance) => {
  app.delete(
    '/users/:userId',
    removeUserSchema,
    async (request, reply) => await removeUserController.handle(request, reply)
  )
}
