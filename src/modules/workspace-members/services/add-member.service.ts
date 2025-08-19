import type { UserRepository } from '../../users/repositories/user.repository'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { IWorkspaceMember } from '../interfaces/workspace-member.interface'
import type { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'

type AddMemberProps = {
  workspaceId: string
  userId: string
  email: string
  role: IWorkspaceMember['role']
}

export class WorkspaceMemberService {
  constructor(
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private workspaceRepository: WorkspaceRepository,
    private userRepository: UserRepository
  ) {}

  async addMember({ workspaceId, email, role }: AddMemberProps) {
    // Receber o usuário logado do controller
    // TODO: Verificar se o usuário logado tem permissão para adicionar membro

    const user = await this.userRepository.findUserByEmail(email)
    if (!user) throw new Error('User not exists.')

    const workspaceAlreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
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
}
