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
      throw new Error(
        'The user cannot remove themselves from the workspace. Instead, delete the workspace.'
      )
    }

    const workspaceAlreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
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
    return removedMember.status
  }
}
