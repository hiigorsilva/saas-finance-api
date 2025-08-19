import type { FastifyInstance } from 'fastify'
import { removeMemberController } from '../instances/remove-member.instance'
import { removeMemberSchema } from '../schemas/remove-member.schema'

export const removeMemberFromWorkspaceRoute = async (app: FastifyInstance) => {
  app.delete(
    '/workspace/:workspaceId/member/:memberId',
    removeMemberSchema,
    async (request, reply) =>
      await removeMemberController.handle(request, reply)
  )
}
