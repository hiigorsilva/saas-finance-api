import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { UserRepository } from '../../users/repositories/user.repository'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'

type GetMemberProps = {
  workspaceId: string
  memberId: string
}

export class GetMemberByIdService {
  constructor(
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceRepository: WorkspaceRepository,
    private userRepository: UserRepository
  ) {}

  async getMemberById({ workspaceId, memberId }: GetMemberProps) {
    const workspaceAlreadyIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceAlreadyIsExists)
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )

    const isUserExists = await this.userRepository.isUserExistsById(memberId)
    if (!isUserExists)
      throw new AppError('User not found.', 404, ErrorCodes.USER_NOT_FOUND)

    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      memberId
    )
    if (!isMember) {
      throw new AppError(
        'You are not a member of this workspace.',
        404,
        ErrorCodes.WORKSPACE_MEMBER_NOT_FOUND
      )
    }

    const getRoleMember = await this.workspaceMemberRepository.getMemberById(
      workspaceId,
      memberId
    )

    return getRoleMember
  }
}
