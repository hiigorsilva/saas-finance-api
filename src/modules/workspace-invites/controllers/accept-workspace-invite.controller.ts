import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { acceptWorkspaceInviteParamsSchema } from '../schemas/accept-workspace-invite.schema'
import type { AcceptWorkspaceInviteService } from '../services/accept-workspace-invite.service'

export class AcceptWorkspaceInviteController {
  constructor(
    private acceptWorkspaceInviteService: AcceptWorkspaceInviteService
  ) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId) {
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)
    }

    const { success, data, error } =
      acceptWorkspaceInviteParamsSchema.safeParse(params)
    if (!success) {
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    const status = await this.acceptWorkspaceInviteService.accept({
      inviteId: data.inviteId,
      userId,
    })

    return reply.status(200).send(dataResponse(status))
  }
}
