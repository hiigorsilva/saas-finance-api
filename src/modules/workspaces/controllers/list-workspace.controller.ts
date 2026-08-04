import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import { paginatedResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { listWorkspaceQuerySchema } from '../schemas/list-workspace.schema'
import type { ListWorkspaceService } from '../services/list-workspace.service'

export class ListWorkspaceController {
  constructor(private listWorkspacesService: ListWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, query } = request
    if (!userId)
      throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

    const { success, data, error } = listWorkspaceQuerySchema.safeParse(query)
    if (!success)
      throw new AppError(
        getValidationMessage(error),
        400,
        ErrorCodes.VALIDATION_ERROR
      )

    const { page, limit, searchWorkspace } = data

    const workspaces = await this.listWorkspacesService.list({
      userId,
      page,
      limit,
      searchWorkspace,
    })

    return reply.status(200).send(paginatedResponse(workspaces))
  }
}
