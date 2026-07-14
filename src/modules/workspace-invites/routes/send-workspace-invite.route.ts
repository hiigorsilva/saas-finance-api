import type { FastifyInstance } from 'fastify'
import { sendWorkspaceInviteController } from '../instances/send-workspace-invite.instance'
import { sendWorkspaceInviteSchema } from '../schemas/send-workspace-invite.schema'

export const sendWorkspaceInviteRoute = async (app: FastifyInstance) => {
  app.post(
    '/workspace/:workspaceId/invite',
    sendWorkspaceInviteSchema,
    async (request, reply) =>
      await sendWorkspaceInviteController.handle(request, reply)
  )
}
