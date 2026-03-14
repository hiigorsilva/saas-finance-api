import type { FastifyInstance } from 'fastify'
import { getDashboardController } from '../instances/get-dashboard.instance'
import { getDashboardSchema } from '../schemas/get-dashboard.schema'

export const getDashboardRoute = async (app: FastifyInstance) => {
  app.get(
    '/:workspaceId/dashboard',
    getDashboardSchema,
    async (request, reply) =>
      await getDashboardController.handle(request, reply)
  )
}
