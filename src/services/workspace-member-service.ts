import type { WorkspaceMember } from '../interfaces/workspace-members/workspace-member'
import type { UserRepository } from '../repositories/user-repository'
import type { WorkspaceMemberRepository } from '../repositories/workspace-member-repository'
import type { WorkspaceRepository } from '../repositories/workspace-repository'

export class WorkspaceMemberService {
  constructor(
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceRepository: WorkspaceRepository,
    private userRepository: UserRepository
  ) {}

  async addMember(
    workspaceId: string,
    userId: string,
    email: string,
    role: WorkspaceMember['role']
  ) {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user) throw new Error('User not exists.')

    const workspaceAlreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId, userId)
    if (!workspaceAlreadyExists) throw new Error('Workspace not found.')

    const isAMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      user.id
    )
    if (isAMember) {
      throw new Error('User is already a member of this workspace.')
    }

    const member = await this.workspaceMemberRepository.addMember(
      workspaceId,
      user.id,
      role
    )
    return member
  }

  async listMembers(workspaceId: string, userId: string) {
    const workspaceAlreadyExists =
      await this.workspaceMemberRepository.isMember(workspaceId, userId)
    if (!workspaceAlreadyExists) {
      throw new Error('Workspace not found or user is not a member.')
    }

    const members =
      await this.workspaceMemberRepository.listMembers(workspaceId)

    return members
  }
}
