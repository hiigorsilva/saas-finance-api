import type { UserRepository } from '../repositories/user-repository'
import type { WorkspaceMemberRepository } from '../repositories/workspace-member-repository'
import type { WorkspaceRepository } from '../repositories/workspace-repository'

export class WorkspaceMemberService {
  constructor(
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceRepository: WorkspaceRepository,
    private userRepository: UserRepository
  ) {}

  async removeMember(workspaceId: string, userId: string, memberId: string) {
    if (userId === memberId) {
      throw new Error('User cannot remove himself from the workspace.')
    }

    const workspaceAlreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId, userId)
    if (!workspaceAlreadyExists) {
      throw new Error('Workspace not found.')
    }

    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      memberId
    )
    if (!isMember) {
      throw new Error('User is not a member of this workspace.')
    }

    const removedMember = await this.workspaceMemberRepository.removeMember(
      workspaceId,
      memberId
    )
    return removedMember
  }
}
