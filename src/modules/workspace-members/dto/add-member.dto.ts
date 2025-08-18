import type { IWorkspaceMember } from '../../../interfaces/workspace-members/workspace-member.interface'

export type IAddMemberToWorkspaceOutput = Pick<
  IWorkspaceMember,
  'id' | 'workspaceId' | 'userId' | 'role'
>
