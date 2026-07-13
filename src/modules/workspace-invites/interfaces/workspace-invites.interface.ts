import type { IWorkspaceInviteIdOutput } from '../dto/workspace-invites.dto'

export interface IWorkspaceInvite {
  id: string
  inviterId: string
  inviteeId: string
  status: string
  createdAt: Date
  expiresAt: Date | null
  acceptedAt: Date | null
  declinedAt: Date | null
}

export class IWorkspaceInviteRepository {
  sendInvite(
    inviterId: string,
    inviteeId: string,
    workspaceId: string
  ): Promise<IWorkspaceInviteIdOutput>

  listInvitesByUser(userId: string): Promise<IWorkspaceInvite[]>

  acceptInvite(inviteId: string): Promise<IWorkspaceInvite | null>

  declineInvite(inviteId: string): Promise<IWorkspaceInvite | null>

  deleteInvite(inviteId: string): Promise<void>
}
