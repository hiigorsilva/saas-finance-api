import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'

export class GetUserRoleService {
  constructor(
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async getUserRole(workspaceId: string, userId: string) {
    const workspaceAlreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceAlreadyExists) {
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )
    }

    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      userId
    )
    if (!isMember) {
      throw new AppError(
        'You are not a member of this workspace.',
        403,
        ErrorCodes.USER_NOT_WORKSPACE_MEMBER
      )
    }

    const roleMember = await this.workspaceMemberRepository.getUserRole(
      workspaceId,
      userId
    )

    return roleMember
  }
}
