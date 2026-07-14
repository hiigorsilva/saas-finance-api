import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { UserRepository } from '../../users/repositories/user.repository'
import type { WorkspaceMemberRepository } from '../../workspace-members/repositories/workspace-members.repository'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { WorkspaceInvitesRepository } from '../repositories/workspace-invites.repository'

type SendWorkspaceInviteProps = {
  workspaceId: string
  inviterId: string
  email: string
}

const INVITE_EXPIRATION_DAYS = 5

export class SendWorkspaceInviteService {
  constructor(
    private workspaceInvitesRepository: WorkspaceInvitesRepository,
    private workspaceRepository: WorkspaceRepository,
    private workspaceMemberRepository: WorkspaceMemberRepository,
    private userRepository: UserRepository
  ) {}

  async send({ workspaceId, inviterId, email }: SendWorkspaceInviteProps) {
    const user = await this.userRepository.findUserByEmail(email)
    if (!user)
      throw new AppError('User not exists.', 404, ErrorCodes.USER_NOT_FOUND)

    if (inviterId === user.id) {
      throw new AppError(
        'You cannot invite yourself to a workspace.',
        400,
        ErrorCodes.WORKSPACE_INVITE_SELF_NOT_ALLOWED
      )
    }

    const workspaceAlreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceAlreadyExists) {
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )
    }

    const isPrivateWorkspace =
      await this.workspaceRepository.isPrivateWorkspace(workspaceId)
    if (isPrivateWorkspace) {
      throw new AppError(
        'Cannot send invites to a private workspace.',
        403,
        ErrorCodes.PRIVATE_WORKSPACE_CANNOT_HAVE_MEMBERS
      )
    }

    const inviterIsOwner = await this.workspaceMemberRepository.isOwner(
      workspaceId,
      inviterId
    )
    if (!inviterIsOwner) {
      throw new AppError(
        'Only the workspace owner can send invites.',
        403,
        ErrorCodes.FORBIDDEN
      )
    }

    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      user.id
    )
    if (isMember) {
      throw new AppError(
        'User is already a member of this workspace.',
        409,
        ErrorCodes.USER_ALREADY_WORKSPACE_MEMBER
      )
    }

    const hasPendingInvite =
      await this.workspaceInvitesRepository.hasPendingInvite(
        workspaceId,
        user.id
      )
    if (hasPendingInvite) {
      throw new AppError(
        'This user already has a pending invite for this workspace.',
        409,
        ErrorCodes.WORKSPACE_INVITE_ALREADY_EXISTS
      )
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + INVITE_EXPIRATION_DAYS)

    return this.workspaceInvitesRepository.sendInvite(
      inviterId,
      user.id,
      workspaceId,
      expiresAt
    )
  }
}
