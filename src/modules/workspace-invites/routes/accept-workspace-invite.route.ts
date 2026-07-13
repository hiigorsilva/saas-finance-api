import type { FastifyInstance } from 'fastify'
import { acceptWorkspaceInviteController } from '../instances/accept-workspace-invite.instance'
import { acceptWorkspaceInviteSchema } from '../schemas/accept-workspace-invite.schema'

export const acceptWorkspaceInviteRoute = async (app: FastifyInstance) => {
  app.post(
    '/workspace/invite/:inviteId/accept',
    acceptWorkspaceInviteSchema,
    async (request, reply) =>
      await acceptWorkspaceInviteController.handle(request, reply)
  )
}
