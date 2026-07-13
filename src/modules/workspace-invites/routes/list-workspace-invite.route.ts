import type { FastifyInstance } from 'fastify'
import { listWorkspaceInviteController } from '../instances/list-workspace-invite.instance'
import { listWorkspaceInviteSchema } from '../schemas/list-workspace-invite.schema'

export const listWorkspaceInviteRoute = async (app: FastifyInstance) => {
  app.get(
    '/workspace/invite',
    listWorkspaceInviteSchema,
    async (request, reply) =>
      await listWorkspaceInviteController.handle(request, reply)
  )
}
