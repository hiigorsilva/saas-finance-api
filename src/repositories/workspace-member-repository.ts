import { and, eq } from 'drizzle-orm'
import { db } from '../db/connection'
import { workspaceMembersTable } from '../db/schemas/workspace-members'
import type {
  IAddMemberWorkspaceResponse,
  IWorkspaceMemberRepository,
  WorkspaceMember,
} from '../interfaces/workspace-members/workspace-member'

export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
  async isMember(workspaceId: string, userId: string): Promise<boolean> {
    const member = await db.query.workspaceMembersTable.findFirst({
      where: and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, userId)
      ),
    })
    return !!member
  }

  async addMember(
    workspaceId: string,
    userId: string,
    role: WorkspaceMember['role']
  ): Promise<IAddMemberWorkspaceResponse> {
    const [member] = await db
      .insert(workspaceMembersTable)
      .values({
        workspaceId: workspaceId,
        userId: userId,
        role: role,
      })
      .returning({
        id: workspaceMembersTable.id,
        workspaceId: workspaceMembersTable.workspaceId,
        userId: workspaceMembersTable.userId,
        role: workspaceMembersTable.role,
      })

    if (!member) {
      throw new Error('Failed to add member to workspace')
    }

    return member
  }

  async listMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const members = await db.query.workspaceMembersTable.findMany({
      where: eq(workspaceMembersTable.workspaceId, workspaceId),
    })
    return members
  }

  async removeMember(
    workspaceId: string,
    memberId: string
  ): Promise<{ status: string }> {
    await db
      .delete(workspaceMembersTable)
      .where(
        and(
          eq(workspaceMembersTable.workspaceId, workspaceId),
          eq(workspaceMembersTable.userId, memberId)
        )
      )
    return { status: 'Member successfully removed.' }
  }
}
