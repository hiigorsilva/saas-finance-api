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
    if (!workspaceAlreadyIsExists) throw new Error('Workspace not found.')

    const isUserExists = await this.userRepository.isUserExistsById(memberId)
    if (!isUserExists) throw new Error('User not found.')

    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      memberId
    )
    if (!isMember) throw new Error('You are not a member of this workspace.')

    const getMember = await this.userRepository.findUserById(memberId)

    return getMember
  }
}
