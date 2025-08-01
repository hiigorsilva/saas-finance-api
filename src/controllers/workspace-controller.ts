import type { FastifyRequest } from 'fastify'
import { createWorkspaceBodySchema } from '../schemas/workspace-schema'
import type { WorkspaceService } from '../services/workspace-service'
import { badRequest, created, ok, unauthorized } from '../shared/utils/http'

export class WorkspaceController {
  constructor(private workspaceService: WorkspaceService) {}

  async create(request: FastifyRequest) {
    const { body, userId } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })

    const { success, data, error } = createWorkspaceBodySchema.safeParse(body)
    if (!success) return badRequest({ error: error.issues })

    const workspace = await this.workspaceService.create(data, userId)
    return created({ workspace })
  }

  async list(request: FastifyRequest) {
    const { userId } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })

    const workspaces = await this.workspaceService.list(userId)
    return ok({ workspaces })
  }
}
