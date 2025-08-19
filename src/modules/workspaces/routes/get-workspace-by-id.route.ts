import type { FastifyInstance } from 'fastify'
import { getWorkspaceController } from '../instances/get-workspace-by-id.instance'
import { getWorkspaceByIdSchema } from '../schemas/get-workspace-by-id.schema'

export const getWorkspaceByIdRoute = async (app: FastifyInstance) => {
  app.get(
    '/workspace/:workspaceId',
    getWorkspaceByIdSchema,
    async (request, reply) =>
      await getWorkspaceController.handle(request, reply)
  )
}
