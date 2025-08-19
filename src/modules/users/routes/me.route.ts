import type { FastifyInstance } from 'fastify'
import { meController } from '../instances/me.instance'
import { meSchema } from '../schemas/me.schema'

export const meRoute = async (app: FastifyInstance) => {
  app.get(
    '/me',
    meSchema,
    async (request, reply) => await meController.handle(request, reply)
  )
}
