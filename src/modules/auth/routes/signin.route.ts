import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { signinController } from '../instances/signin.instance'
import { signinSchema } from '../schemas/signin.schema'

export const signinRoute = (app: FastifyInstance) => {
  app.post(
    '/signin',
    signinSchema,
    async (request: FastifyRequest, reply: FastifyReply) =>
      await signinController.handle(request, reply)
  )
}
