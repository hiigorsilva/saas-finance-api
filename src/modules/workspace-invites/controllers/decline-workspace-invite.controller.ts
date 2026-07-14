import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { declineWorkspaceInviteParamsSchema } from '../schemas/decline-workspace-invite.schema'
import type { DeclineWorkspaceInviteService } from '../services/decline-workspace-invite.service'

export class DeclineWorkspaceInviteController {
  constructor(
    private declineWorkspaceInviteService: DeclineWorkspaceInviteService
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId) {
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)
    }

    const { success, data, error } =
      declineWorkspaceInviteParamsSchema.safeParse(params)
    if (!success) {
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    const status = await this.declineWorkspaceInviteService.decline({
      inviteId: data.inviteId,
      userId,
    })

    return reply.status(200).send(dataResponse(status))
  }
}
