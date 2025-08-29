import type { FastifyInstance } from 'fastify'
import { listInactiveUserController } from '../instances/list-inactive-user.instance'
import { listInactiveUserSchema } from '../schemas/list-inactive-user.schema'

export const listInactiveUserRoute = async (app: FastifyInstance) => {
  app.get(
    '/users-inactive',
    listInactiveUserSchema,
    async (request, reply) =>
      await listInactiveUserController.handle(request, reply)
  )
}
