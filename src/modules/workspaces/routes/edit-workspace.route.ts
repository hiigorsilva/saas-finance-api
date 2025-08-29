import type { FastifyInstance } from 'fastify'
import { editWorkspaceController } from '../instances/edit-workspace.instance'
import { editWorkspaceSchema } from '../schemas/edit-workspace.schema'

export const editWorkspaceRoute = async (app: FastifyInstance) => {
  app.put(
    '/workspace/:workspaceId',
    editWorkspaceSchema,
    async (request, reply) =>
      await editWorkspaceController.handle(request, reply)
  )
}
