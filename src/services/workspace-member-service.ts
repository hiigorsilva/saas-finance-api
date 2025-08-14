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

    const isPrivateWorkspace =
      await this.workspaceRepository.isPrivateWorkspace(workspaceId)
    if (isPrivateWorkspace)
      throw new Error('Cannot add members to a private workspace.')

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
