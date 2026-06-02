import type { FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../../../errors/app-error'
import { dataResponse } from '../../../shared/utils/http'
import { getValidationMessage } from '../../../shared/utils/validation'
import { createWorkspaceBodySchema } from '../schemas/create-workspace.schema'
import type { CreateWorkspaceService } from '../services/create-workspace.service'

export class CreateWorkspaceController {
  constructor(private createWorkspaceService: CreateWorkspaceService) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    const { userId, body } = request
    if (!userId) throw new AppError('Unauthorized.', 401)

    const { success, data, error } = createWorkspaceBodySchema.safeParse(body)
    if (!success) throw new AppError(getValidationMessage(error), 400)

    const workspace = await this.createWorkspaceService.create(data, userId)

    return reply.status(201).send(dataResponse(workspace))
  }
}
