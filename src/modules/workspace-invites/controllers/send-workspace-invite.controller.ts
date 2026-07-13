import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  sendWorkspaceInviteBodySchema,
  sendWorkspaceInviteParamsSchema,
} from '../schemas/send-workspace-invite.schema'
import type { SendWorkspaceInviteService } from '../services/send-workspace-invite.service'

export class SendWorkspaceInviteController {
  constructor(private sendWorkspaceInviteService: SendWorkspaceInviteService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params, body } = request
    if (!userId) {
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)
    }

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = sendWorkspaceInviteParamsSchema.safeParse(params)
    if (!successParams) {
      throw new AppError(
        getValidationMessage(errorParams),
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    const {
      success: successBody,
      data: dataBody,
      error: errorBody,
    } = sendWorkspaceInviteBodySchema.safeParse(body)
    if (!successBody) {
      throw new AppError(
        getValidationMessage(errorBody),
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    const invite = await this.sendWorkspaceInviteService.send({
      workspaceId: dataParams.workspaceId,
      inviterId: userId,
      email: dataBody.email,
    })

    return reply.status(201).send(dataResponse(invite))
  }
}
