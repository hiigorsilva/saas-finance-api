import type { FastifyInstance } from 'fastify'
import { listWorkspaceController } from '../instances/list-workspace.instance'
import { listWorkspaceSchema } from '../schemas/list-workspace.schema'

export const listWorkspaceRoute = async (app: FastifyInstance) => {
  app.get(
    '/workspace',
    listWorkspaceSchema,
    async (request, reply) =>
      await listWorkspaceController.handle(request, reply)
  )
}
