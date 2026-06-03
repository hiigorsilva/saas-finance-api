import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { getWorkspaceByIdParamsSchema } from '../schemas/get-workspace-by-id.schema'
import type { GetWorkspaceService } from '../services/get-workspace.service'

export class GetWorkspaceController {
  constructor(private getWorkspaceService: GetWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const { success, data, error } =
      getWorkspaceByIdParamsSchema.safeParse(params)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { workspaceId } = data

    const workspace = await this.getWorkspaceService.getWorkspaceById({
      userId,
      workspaceId,
    })

    return reply.status(200).send(dataResponse(workspace))
  }
}
