import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { WorkspaceMemberController } from '../../controllers/workspace-member-controller'
import { UserRepository } from '../../repositories/user-repository'
import { WorkspaceMemberRepository } from '../../repositories/workspace-member-repository'
import { WorkspaceRepository } from '../../repositories/workspace-repository'
import { removeMemberSchema } from '../../schemas/workspace-members/remove-member-schema'
import { WorkspaceMemberService } from '../../services/workspace-member-service'
import { badRequest, internalServerError } from '../../shared/utils/http'
import { parseResponse } from '../../shared/utils/parse-response'

const workspaceMemberRepository = new WorkspaceMemberRepository()
const workspaceRepository = new WorkspaceRepository()
const userRepository = new UserRepository()
const workspaceMemberService = new WorkspaceMemberService(
  workspaceMemberRepository,
  workspaceRepository,
  userRepository
)
const workspaceMemberController = new WorkspaceMemberController(
  workspaceMemberService
)

export const workspaceMemberRoute = async (app: FastifyInstance) => {
  app.delete(
    '/workspace/:workspaceId/member/:memberId',
    removeMemberSchema,
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const response = await workspaceMemberController.removeMember(request)
        return reply.status(response.statusCode).send(response)
      } catch (error) {
        if (error instanceof Error) {
          return reply
            .status(400)
            .send(parseResponse(badRequest({ error: error.message })))
        }
        return reply
          .status(500)
          .send(
            parseResponse(
              internalServerError({ error: 'Internal server error' })
            )
          )
      }
    }
  )
}
