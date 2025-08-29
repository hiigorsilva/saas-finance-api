import type { FastifyInstance } from 'fastify'
import { getMemberByIdController } from '../instances/get-member-by-id.instance'
import { getMemberByIdSchema } from '../schemas/get-member-by-id.schema'

export const getMemberFromWorkspaceById = async (app: FastifyInstance) => {
  app.get(
    '/workspace/:workspaceId/member/:memberId',
    getMemberByIdSchema,
    async (request, reply) =>
      await getMemberByIdController.handle(request, reply)
  )
}
