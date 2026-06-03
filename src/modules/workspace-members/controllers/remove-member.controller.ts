import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { removeMemberParamsSchema } from '../schemas/remove-member.schema'
import type { RemoveMemberService } from '../services/remove-member.service'

export class RemoveMemberController {
  constructor(private removeMemberService: RemoveMemberService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const { success, data, error } = removeMemberParamsSchema.safeParse(params)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { workspaceId, memberId } = data

    const member = await this.removeMemberService.removeMember({
      workspaceId,
      userId,
      memberId,
    })

    return reply.status(200).send(dataResponse(member))
  }
}
