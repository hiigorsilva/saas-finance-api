import type { FastifyReply, FastifyRequest } from 'fastify'
import { Permissions, RolePermissions } from '../data/roles'
import { AppError, ErrorCodes } from '../errors/app-error'
import { WorkspaceMemberRepository } from '../modules/workspace-members/repositories/workspace-members.repository'
import { GetUserRoleService } from '../modules/workspace-members/services/get-user-role.service'
import { WorkspaceRepository } from '../modules/workspaces/repositories/workspace.repository'

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
  _reply: FastifyReply
) => {
  const { userId, params, method } = request
  if (!userId) throw new AppError('Unauthorized.', 401, ErrorCodes.UNAUTHORIZED)

  const { workspaceId } = params as { workspaceId: string }
  if (!workspaceId)
    throw new AppError(
      'Workspace not found.',
      404,
      ErrorCodes.WORKSPACE_NOT_FOUND
    )

  method.toUpperCase()

  const requiredPermission = httpMethodToPermission[method]
  if (!requiredPermission)
    throw new AppError(
      'Method not allowed.',
      405,
      ErrorCodes.METHOD_NOT_ALLOWED
    )

  const roleMember = await getUserRole(userId, workspaceId)
  if (!roleMember) {
    throw new AppError(
      'No role found for user in workspace.',
      403,
      ErrorCodes.USER_NOT_WORKSPACE_MEMBER
    )
  }

  const userPermission = RolePermissions[roleMember]
  const userHasPermission = requiredPermission.some(permission =>
    userPermission.includes(permission)
  )

  if (!userHasPermission) {
    throw new AppError(
      'User does not have permission.',
      403,
      ErrorCodes.FORBIDDEN
    )
  }
}
