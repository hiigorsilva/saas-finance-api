import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import {
  editWorkspaceBodySchema,
  editWorkspaceParamsSchema,
} from '../schemas/edit-workspace.schema'
import type { EditWorkspaceService } from '../services/edit-workspace.service'

export class EditWorkspaceController {
  constructor(private editWorkspacesService: EditWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, body, params } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = editWorkspaceParamsSchema.safeParse(params)
    if (!successParams)
      throw new AppError(
        getValidationMessage(errorParams),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { success, data, error } = editWorkspaceBodySchema.safeParse(body)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { workspaceId } = dataParams

    const workspace = await this.editWorkspacesService.edit({
      userId,
      workspaceId,
      data,
    })

    return reply.status(200).send(dataResponse(workspace))
  }
}
