import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceInvitesRepository } from '../repositories/workspace-invites.repository'

type DeclineWorkspaceInviteProps = {
  inviteId: string
  userId: string
}

export class DeclineWorkspaceInviteService {
  constructor(private workspaceInvitesRepository: WorkspaceInvitesRepository) {}

  async decline({ inviteId, userId }: DeclineWorkspaceInviteProps) {
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

    return this.workspaceInvitesRepository.declineInvite(invite.id, userId)
  }
}
