import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { UserRepository } from '../../users/repositories/user.repository'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { IWorkspaceMember } from '../interfaces/workspace-member.interface'
import type { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'

type AddMemberProps = {
  workspaceId: string
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
    const user = await this.userRepository.findUserByEmail(email)
    if (!user)
      throw new AppError('User not exists.', 404, ErrorCodes.USER_NOT_FOUND)

    const workspaceAlreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceAlreadyExists)
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )

    const isPrivateWorkspace =
      await this.workspaceRepository.isPrivateWorkspace(workspaceId)
    if (isPrivateWorkspace)
      throw new AppError(
        'Cannot add members to a private workspace.',
        403,
        ErrorCodes.PRIVATE_WORKSPACE_CANNOT_HAVE_MEMBERS
      )

    const isAMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      user.id
    )
    if (isAMember) {
      throw new AppError(
        'User is already a member of this workspace.',
        409,
        ErrorCodes.USER_ALREADY_WORKSPACE_MEMBER
      )
    }

    const member = await this.workspaceMemberRepository.addMember(
      workspaceId,
      user.id,
      role
    )
    return member
  }
}
