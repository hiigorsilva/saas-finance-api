import type { FastifyInstance } from 'fastify'
import { addMemberToWorkspaceController } from '../instances/add-member.instance'
import { addMemberToWorkspaceSchema } from '../schemas/add-member.schema'

export const addMemberToWorkspaceRoute = (app: FastifyInstance) => {
  app.post(
    '/workspace/:workspaceId/member',
    addMemberToWorkspaceSchema,
    async (request, reply) =>
      await addMemberToWorkspaceController.handle(request, reply)
  )
}
