import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { getMemberByIdParamsSchema } from '../schemas/get-member-by-id.schema'
import type { GetMemberByIdService } from '../services/get-member-by-id.service'

export class GetMemberByIdController {
  constructor(private getMemberByIdService: GetMemberByIdService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const { success, data, error } = getMemberByIdParamsSchema.safeParse(params)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { workspaceId, memberId } = data

    const member = await this.getMemberByIdService.getMemberById({
      workspaceId,
      memberId,
    })

    return reply.status(200).send(dataResponse(member))
  }
}
