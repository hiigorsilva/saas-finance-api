import type { FastifyInstance } from 'fastify'
import { listUserController } from '../instances/list-user.instance'
import { listUserSchema } from '../schemas/list-user.schema'

export const listUserRoute = async (app: FastifyInstance) => {
  app.get(
    '/users',
    listUserSchema,
    async (request, reply) => await listUserController.handle(request, reply)
  )
}
