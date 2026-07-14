import type {
  IWorkspaceInviteActionOutput,
  IWorkspaceInviteIdOutput,
  IWorkspaceInviteListOutput,
} from '../dto/workspace-invites.dto'

export interface IWorkspaceInvite {
  id: string
  workspaceId: string
  inviterId: string
  inviteeId: string
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
  createdAt: Date
  expiresAt: Date | null
  acceptedAt: Date | null
  declinedAt: Date | null
}

export interface IWorkspaceInviteRepository {
  sendInvite(
    inviterId: string,
    inviteeId: string,
    workspaceId: string,
    expiresAt: Date
  ): Promise<IWorkspaceInviteIdOutput>

  listInvitesByUser(userId: string): Promise<IWorkspaceInviteListOutput[]>

  findPendingInviteById(
    inviteId: string,
    inviteeId: string
  ): Promise<IWorkspaceInvite | null>

  acceptInvite(
    inviteId: string,
    inviteeId: string
  ): Promise<IWorkspaceInviteActionOutput>

  declineInvite(
    inviteId: string,
    inviteeId: string
  ): Promise<IWorkspaceInviteActionOutput>

  hasPendingInvite(workspaceId: string, inviteeId: string): Promise<boolean>

  deleteInvite(inviteId: string): Promise<void>
}
