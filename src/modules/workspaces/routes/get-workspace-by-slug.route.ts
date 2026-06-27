import type { FastifyInstance } from 'fastify'
import { getWorkspaceDetailsController } from '../instances/get-workspace-by-slug.instance'
import { getWorkspaceBySlugSchema } from '../schemas/get-workspace-by-slug.schema'

export const getWorkspaceBySlugRoute = async (app: FastifyInstance) => {
  app.get(
    '/workspace/slug/:slug',
    getWorkspaceBySlugSchema,
    async (request, reply) =>
      await getWorkspaceDetailsController.handle(request, reply)
  )
}
