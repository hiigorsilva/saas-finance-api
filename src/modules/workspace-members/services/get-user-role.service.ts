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
      throw new Error('Workspace not found.')
    }

    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      userId
    )
    if (!isMember) throw new Error('You are not a member of this workspace.')

    const roleMember = await this.workspaceMemberRepository.getUserRole(
      workspaceId,
      userId
    )

    return roleMember
  }
}
