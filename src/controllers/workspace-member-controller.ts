import type { FastifyRequest } from 'fastify'
import {
  addMemberBodySchema,
  addMemberParamsSchema,
} from '../schemas/workspace-members/add-member-schema'
import { listMembersParamsSchema } from '../schemas/workspace-members/list-members-schema'
import type { WorkspaceMemberService } from '../services/workspace-member-service'
import { badRequest, created, ok, unauthorized } from '../shared/utils/http'

export class WorkspaceMemberController {
  constructor(private workspaceMemberService: WorkspaceMemberService) {}

  async addMember(request: FastifyRequest) {
    const { userId, body, params } = request

    if (!userId) return unauthorized({ error: 'Unauthorized.' })

    const {
      success: successParams,
      data: dataParams,
      error: errorParams,
    } = addMemberParamsSchema.safeParse(params)
    if (!successParams) return badRequest({ error: errorParams.message })

    const { success, data, error } = addMemberBodySchema.safeParse(body)
    if (!success) return badRequest({ error: error.message })

    const member = await this.workspaceMemberService.addMember(
      dataParams.workspaceId,
      userId,
      data.email,
      data.role
    )

    return created({ data: member })
  }

  async listMembers(request: FastifyRequest) {
    const { userId, params } = request
    if (!userId) return unauthorized({ error: 'Unauthorized.' })

    const { success, data, error } = listMembersParamsSchema.safeParse(params)
    if (!success) return badRequest({ error: error.message })

    const members = await this.workspaceMemberService.listMembers(
      data.workspaceId,
      userId
    )

    return ok({ data: members })
  }
}
