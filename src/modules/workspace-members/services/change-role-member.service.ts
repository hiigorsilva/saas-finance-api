import { AppError } from '../../../errors/app-error'
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
    const workspaceAlreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceAlreadyExists) {
      throw new AppError('Workspace not found.', 404)
    }

    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      memberId
    )
    if (!isMember) {
      throw new AppError('User is not a member of this workspace.', 404)
    }

    const isOwner = await this.workspaceMemberRepository.isOwner(
      workspaceId,
      memberId
    )
    if (isOwner) {
      throw new AppError(
        'You cannot change the role of the workspace owner as they are the original creator.',
        403
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
