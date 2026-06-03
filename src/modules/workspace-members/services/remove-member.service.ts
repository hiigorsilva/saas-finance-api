import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'

type RemoveMemberProps = {
  workspaceId: string
  userId: string
  memberId: string
}

export class RemoveMemberService {
  constructor(
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async removeMember({ workspaceId, userId, memberId }: RemoveMemberProps) {
    if (userId === memberId) {
      throw new AppError(
        'The user cannot remove themselves from the workspace. Instead, delete the workspace.',
        403,
        ErrorCodes.USER_CANNOT_REMOVE_SELF_FROM_WORKSPACE
      )
    }

    const isOwner = await this.workspaceMemberRepository.isOwner(
      workspaceId,
      memberId
    )
    if (isOwner) {
      throw new AppError(
        'The workspace owner cannot be removed.',
        403,
        ErrorCodes.WORKSPACE_OWNER_CANNOT_BE_REMOVED
      )
    }

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
      memberId
    )
    if (!isMember) {
      throw new AppError(
        'User is not a member of this workspace.',
        404,
        ErrorCodes.WORKSPACE_MEMBER_NOT_FOUND
      )
    }

    const removedMember = await this.workspaceMemberRepository.removeMember(
      workspaceId,
      memberId
    )
    return removedMember.status
  }
}
