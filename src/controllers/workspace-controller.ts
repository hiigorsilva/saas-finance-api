import type { FastifyRequest } from 'fastify'
import {
  createWorkspaceBodySchema,
  type ParamsDeleteWorkspaceType,
  updateWorkspaceBodySchema,
  updateWorkspaceParamsSchema,
} from '../schemas/workspace-schema'
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

  async delete(request: FastifyRequest) {
    const { userId, params } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })

    const { workspaceId } = params as ParamsDeleteWorkspaceType
    if (!workspaceId) return badRequest({ error: 'Workspace id is required.' })

    const workspaceDeleted = await this.workspaceService.delete(
      workspaceId,
      userId
    )
    return ok({ status: workspaceDeleted })
  }

  async update(request: FastifyRequest) {
    const { userId, body, params } = request
    if (!userId) return unauthorized({ error: 'Unauthorized' })

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = updateWorkspaceParamsSchema.safeParse(params)
    if (!successParams) return badRequest({ error: errorParams.issues })

    const { success, data, error } = updateWorkspaceBodySchema.safeParse(body)
    if (!success) return badRequest({ error: error.issues })

    const workspace = await this.workspaceService.update(
      dataParams.workspaceId,
      userId,
      data
    )
    return ok({ workspace })
  }
}
