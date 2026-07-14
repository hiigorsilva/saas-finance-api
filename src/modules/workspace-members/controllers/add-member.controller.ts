import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  addMemberBodySchema,
  addMemberParamsSchema,
} from '../schemas/add-member.schema'
import type { WorkspaceMemberService } from '../services/add-member.service'

export class AddMemberController {
  constructor(private workspaceMemberService: WorkspaceMemberService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, body, params } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = addMemberParamsSchema.safeParse(params)
    if (!successParams)
      throw new AppError(
        getValidationMessage(errorParams),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { success, data, error } = addMemberBodySchema.safeParse(body)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { workspaceId } = dataParams
    const { email } = data

    const member = await this.workspaceMemberService.addMember({
      workspaceId,
      inviterId: userId,
      email,
    })

    return reply.status(201).send(dataResponse(member))
  }
}
