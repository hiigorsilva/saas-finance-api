import type { FastifyInstance } from 'fastify'
import { createWorkspaceController } from '../instances/create-workspace.instance'
import { createWorkspaceSchema } from '../schemas/create-workspace.schema'

export const createWorkspaceRoute = async (app: FastifyInstance) => {
  app.post(
    '/workspace',
    createWorkspaceSchema,
    async (request, reply) =>
      await createWorkspaceController.handle(request, reply)
  )
}
