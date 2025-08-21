import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { ChangeRoleMemberDTO } from '../dto/change-role-member.dto'
import type { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'

type ChangeRoleMemberProps = {
  workspaceId: string
  memberId: string
  newRole: ChangeRoleMemberDTO
}

export class ChangeRoleMemberService {
  constructor(
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async changeMemberRole({
    workspaceId,
    memberId,
    newRole,
  }: ChangeRoleMemberProps) {
    if (newRole === 'OWNER') {
      throw new Error('Only the workspace creator can have the owner role.')
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
    if (!isMember) throw new Error('User is not a member of this workspace.')

    const isOwner = await this.workspaceMemberRepository.isOwner(
      workspaceId,
      memberId
    )
    if (isOwner) {
      throw new Error(
        'You cannot change the role of the workspace owner as they are the original creator.'
      )
    }

    const changedRole = await this.workspaceMemberRepository.changeMemberRole(
      workspaceId,
      memberId,
      newRole
    )
    return changedRole.status
  }
}
