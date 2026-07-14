import type { FastifyInstance } from 'fastify'
import { declineWorkspaceInviteController } from '../instances/decline-workspace-invite.instance'
import { declineWorkspaceInviteSchema } from '../schemas/decline-workspace-invite.schema'

export const declineWorkspaceInviteRoute = async (app: FastifyInstance) => {
  app.post(
    '/workspace/invite/:inviteId/decline',
    declineWorkspaceInviteSchema,
    async (request, reply) =>
      await declineWorkspaceInviteController.handle(request, reply)
  )
}
