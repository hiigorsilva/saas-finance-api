import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { removeWorkspaceParamsSchema } from '../schemas/remove-workspace.schema'
import type { RemoveWorkspaceService } from '../services/remove-workspace.service'

export class RemoveWorkspaceController {
  constructor(private removeWorkspaceService: RemoveWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, params } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const { success, data, error } =
      removeWorkspaceParamsSchema.safeParse(params)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const { workspaceId } = data
    const workspace = await this.removeWorkspaceService.remove({
      workspaceId,
      userId,
    })

    return reply.status(200).send(dataResponse(workspace))
  }
}
