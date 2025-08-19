import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { registerController } from '../instances/register.instance'
import { registerSchema } from '../schemas/register.schema'

export const registerRoute = async (app: FastifyInstance) => {
  app.post(
    '/register',
    registerSchema,
    async (request: FastifyRequest, reply: FastifyReply) =>
      await registerController.handle(request, reply)
  )
}
