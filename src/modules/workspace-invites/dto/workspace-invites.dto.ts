import type { IWorkspaceInvite } from '../interfaces/workspace-invites.interface'

export type IWorkspaceInviteIdOutput = Pick<IWorkspaceInvite, 'id'>

export type IWorkspaceInviteActionOutput = {
  status: string
}

export type IWorkspaceInviteListOutput = Pick<
  IWorkspaceInvite,
  'id' | 'workspaceId' | 'inviterId' | 'inviteeId' | 'status' | 'expiresAt'
> & {
  inviterName: string
  workspaceName: string
}
