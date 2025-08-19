import type { FastifyInstance } from 'fastify'
import { addMemberController } from '../instances/add-member.instance'
import { addMemberSchema } from '../schemas/add-member.schema'

export const addMemberToWorkspaceRoute = async (app: FastifyInstance) => {
  app.post(
    '/workspace/:workspaceId/member',
    addMemberSchema,
    async (request, reply) => await addMemberController.handle(request, reply)
  )
}
