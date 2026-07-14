import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import type { ListWorkspaceInviteService } from '../services/list-workspace-invite.service'

export class ListWorkspaceInviteController {
  constructor(private listWorkspaceInviteService: ListWorkspaceInviteService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request
    if (!userId) {
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)
    }

    const invites = await this.listWorkspaceInviteService.list(userId)
    return reply.status(200).send(dataResponse(invites))
  }
}
