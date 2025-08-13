export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
  joinedAt: Date
}

export type IAddMemberWorkspaceResponse = Pick<
  WorkspaceMember,
  'id' | 'workspaceId' | 'userId' | 'role'
>

export interface IWorkspaceMemberRepository {
  addMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceMember['role']
  ): Promise<IAddMemberWorkspaceResponse>

  isMember(workspaceId: string, userId: string): Promise<boolean>

  // removeMember(workspaceId: string, userId: string): Promise<void>

  // changeMemberRole(
  //   workspaceId: string,
  //   userId: string,
  //   newRole: WorkspaceMember['role']
  // ): Promise<void>

  // listMembers(workspaceId: string): Promise<WorkspaceMember[]>
}
