import type { FastifyInstance } from 'fastify'
import { changeRoleMemberController } from '../instances/change-role-member.instance'
import { changeRoleMemberSchema } from '../schemas/change-role-member.schema'

export const changeRoleMemberRoute = async (app: FastifyInstance) => {
  app.put(
    '/workspace/:workspaceId/member/:memberId',
    changeRoleMemberSchema,
    async (request, reply) =>
      await changeRoleMemberController.handle(request, reply)
  )
}
