import type { IPaginationOutput } from '../../../shared/types/response'
import type { IAddMemberToWorkspaceOutput } from '../dto/add-member.dto'

export interface IWorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  joinedAt: Date
}

export interface IWorkspaceMemberRepository {
  addMember(
    workspaceId: string,
    userId: string,
    role: IWorkspaceMember['role']
  ): Promise<IAddMemberToWorkspaceOutput>

  isMember(workspaceId: string, memberId: string): Promise<boolean>

  listMembers(
    workspaceId: string,
    page?: number,
    limit?: number
  ): Promise<IPaginationOutput<IWorkspaceMember>>

  removeMember(
    workspaceId: string,
    memberId: string
  ): Promise<{ status: string }>

  changeMemberRole(
    workspaceId: string,
    memberId: string,
    newRole: IWorkspaceMember['role']
  ): Promise<{ status: string }>
}
