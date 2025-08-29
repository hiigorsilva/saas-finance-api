import type { FastifyInstance } from 'fastify'
import { removeWorkspaceController } from '../instances/remove-workspace.instance'
import { removeWorkspaceSchema } from '../schemas/remove-workspace.schema'

export const removeWorkspaceRoute = async (app: FastifyInstance) => {
  app.delete(
    '/workspace/:workspaceId',
    removeWorkspaceSchema,
    async (request, reply) =>
      await removeWorkspaceController.handle(request, reply)
  )
}
