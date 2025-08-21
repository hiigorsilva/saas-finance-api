import type { IPaginationOutput } from '../../../shared/types/response'
import type { IAddMemberToWorkspaceOutput } from '../dto/add-member.dto'
import type { ChangeRoleMemberDTO } from '../dto/change-role-member.dto'
import type { IMembersWithRole } from '../dto/list-member.dto'

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

  isOwner(workspaceId: string, memberId: string): Promise<boolean>

  listAllMembers(
    workspaceId: string,
    page?: number,
    limit?: number
  ): Promise<IPaginationOutput<IMembersWithRole>>

  getMemberById(
    workspaceId: string,
    memberId: string
  ): Promise<IMembersWithRole>

  removeMember(
    workspaceId: string,
    memberId: string
  ): Promise<{ status: string }>

  changeMemberRole(
    workspaceId: string,
    memberId: string,
    newRole: ChangeRoleMemberDTO
  ): Promise<{ status: string }>
}
