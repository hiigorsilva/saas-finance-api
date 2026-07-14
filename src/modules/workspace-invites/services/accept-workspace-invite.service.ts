import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceMemberRepository } from '../../workspace-members/repositories/workspace-members.repository'
import type { WorkspaceInvitesRepository } from '../repositories/workspace-invites.repository'

type AcceptWorkspaceInviteProps = {
  inviteId: string
  userId: string
}

export class AcceptWorkspaceInviteService {
  constructor(
    private workspaceInvitesRepository: WorkspaceInvitesRepository,
    private workspaceMemberRepository: WorkspaceMemberRepository
  ) {}

  async accept({ inviteId, userId }: AcceptWorkspaceInviteProps) {
    const invite = await this.workspaceInvitesRepository.findPendingInviteById(
      inviteId,
      userId
    )

    if (!invite) {
      throw new AppError(
        'Invite not found.',
        404,
        ErrorCodes.WORKSPACE_INVITE_NOT_FOUND
      )
    }

    if (invite.expiresAt && invite.expiresAt <= new Date()) {
      await this.workspaceInvitesRepository.deleteInvite(invite.id)
      throw new AppError(
        'Invite expired.',
        410,
        ErrorCodes.WORKSPACE_INVITE_EXPIRED
      )
    }

    const isMember = await this.workspaceMemberRepository.isMember(
      invite.workspaceId,
      userId
    )
    if (isMember) {
      await this.workspaceInvitesRepository.deleteInvite(invite.id)
      throw new AppError(
        'User is already a member of this workspace.',
        409,
        ErrorCodes.USER_ALREADY_WORKSPACE_MEMBER
      )
    }

    await this.workspaceMemberRepository.addMember(
      invite.workspaceId,
      userId,
      'MEMBER'
    )

    return this.workspaceInvitesRepository.acceptInvite(invite.id, userId)
  }
}
