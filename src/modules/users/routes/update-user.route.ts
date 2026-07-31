import type { FastifyInstance } from 'fastify'
import { updateUserController } from '../instances/update-user.instance'
import { updateUserSchema } from '../schemas/update-user.schema'

export const updateUserRoute = async (app: FastifyInstance) => {
  app.put(
    '/me',
    updateUserSchema,
    async (request, reply) => await updateUserController.handle(request, reply)
  )
}
