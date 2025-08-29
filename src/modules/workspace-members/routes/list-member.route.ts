import type { FastifyInstance } from 'fastify'
import { listMemberController } from '../instances/list-member.instance'
import { listMembersSchema } from '../schemas/list-member.schema'

export const listMemberWorkspaceRoute = async (app: FastifyInstance) => {
  app.get(
    '/workspace/:workspaceId/member',
    listMembersSchema,
    async (request, reply) => await listMemberController.handle(request, reply)
  )
}
