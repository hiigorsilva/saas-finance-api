import type { FastifyReply, FastifyRequest } from 'fastify'
import { Permissions, RolePermissions } from '../data/roles'
import { WorkspaceMemberRepository } from '../modules/workspace-members/repositories/workspace-members.repository'
import { GetUserRoleService } from '../modules/workspace-members/services/get-user-role.service'
import { WorkspaceRepository } from '../modules/workspaces/repositories/workspace.repository'
import {
  badRequest,
  forbidden,
  internalServerError,
  unauthorized,
} from '../shared/utils/http'
import { parseResponse } from '../shared/utils/parse-response'

const workspaceMemberRepository = new WorkspaceMemberRepository()
const workspaceRepository = new WorkspaceRepository()
const getUserRoleService = new GetUserRoleService(
  workspaceMemberRepository,
  workspaceRepository
)

const getUserRole = async (userId: string, workspaceId: string) => {
  const roleMember = await getUserRoleService.getUserRole(workspaceId, userId)
  return roleMember
}

const httpMethodToPermission: Record<string, Permissions[]> = {
  GET: [Permissions.TRANSACTION_VIEW],
  POST: [Permissions.TRANSACTION_CREATE, Permissions.WORKSPACE_INVITE_MEMBER],
  PUT: [
    Permissions.TRANSACTION_UPDATE,
    Permissions.WORKSPACE_UPDATE_MEMBER_ROLE,
  ],
  DELETE: [Permissions.TRANSACTION_DELETE, Permissions.WORKSPACE_DELETE_MEMBER],
}

export const hasPermission = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const { userId, params, method } = request
    if (!userId) {
      return reply
        .status(401)
        .send(parseResponse(unauthorized({ error: 'Unauthorized.' })))
    }

    const { workspaceId } = params as { workspaceId: string }
    if (!workspaceId) {
      return reply
        .status(400)
        .send(parseResponse(badRequest({ error: 'Workspace not found.' })))
    }

    method.toUpperCase()

    const requiredPermission = httpMethodToPermission[method]
    if (!requiredPermission) {
      return reply
        .status(400)
        .send(parseResponse(badRequest({ error: 'Method not allowed.' })))
    }

    const roleMember = await getUserRole(userId, workspaceId)
    if (!roleMember) {
      return reply
        .status(400)
        .send(
          parseResponse(
            forbidden({ error: 'No role found for user in workspace.' })
          )
        )
    }

    const userPermission = RolePermissions[roleMember]
    const userHasPermission = requiredPermission.some(permission =>
      userPermission.includes(permission)
    )

    if (!userHasPermission) {
      return reply
        .status(400)
        .send(
          parseResponse(forbidden({ error: 'User does not have permission.' }))
        )
    }
  } catch (error) {
    if (error instanceof Error) {
      return reply
        .status(400)
        .send(parseResponse(badRequest({ error: error.message })))
    }
    return reply
      .status(500)
      .send(
        parseResponse(internalServerError({ error: 'Internal server error' }))
      )
  }
}
