import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  changeRoleMemberBodySchema,
  changeRoleMemberParamsSchema,
} from '../schemas/change-role-member.schema'
import type { ChangeRoleMemberService } from '../services/change-role-member.service'

export class ChangeRoleMemberController {
  constructor(private changeRoleMemberService: ChangeRoleMemberService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, body, params } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const { success, data, error } = changeRoleMemberBodySchema.safeParse(body)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = changeRoleMemberParamsSchema.safeParse(params)
    if (!successParams)
      throw new AppError(
        getValidationMessage(errorParams),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { workspaceId, memberId } = dataParams
    const { newRole } = data

    const changedRoleMember =
      await this.changeRoleMemberService.changeMemberRole({
        workspaceId,
        memberId,
        newRole,
      })

    return reply.status(200).send(dataResponse(changedRoleMember))
  }
}
