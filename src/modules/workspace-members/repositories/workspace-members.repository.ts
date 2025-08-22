import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { usersTable } from '../../../db/schemas/users'
import { workspaceMembersTable } from '../../../db/schemas/workspace-members'
import type { IPaginationOutput } from '../../../shared/types/response'
import type { IAddMemberToWorkspaceOutput } from '../dto/add-member.dto'
import type { ChangeRoleMemberDTO } from '../dto/change-role-member.dto'
import type { IMembersWithRole } from '../dto/list-member.dto'
import type {
  IWorkspaceMember,
  IWorkspaceMemberRepository,
} from '../interfaces/workspace-member.interface'

export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
  async isMember(workspaceId: string, memberId: string): Promise<boolean> {
    const member = await db.query.workspaceMembersTable.findFirst({
      where: and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, memberId)
      ),
    })
    return !!member
  }

  async isOwner(workspaceId: string, memberId: string): Promise<boolean> {
    const member = await db.query.workspaceMembersTable.findFirst({
      where: and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, memberId),
        eq(workspaceMembersTable.role, 'OWNER')
      ),
    })
    return !!member
  }

  async addMember(
    workspaceId: string,
    userId: string,
    role: IWorkspaceMember['role']
  ): Promise<IAddMemberToWorkspaceOutput> {
    const [member] = await db
      .insert(workspaceMembersTable)
      .values({
        workspaceId: workspaceId,
        userId: userId,
        role: role,
        joinedAt: new Date(),
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

  async listAllMembers(
    workspaceId: string,
    page = 1,
    limit = 10
  ): Promise<IPaginationOutput<IMembersWithRole>> {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, Math.min(limit, 100))
    const offset = (safePage - 1) * safeLimit

    const [totalCount, members] = await Promise.all([
      db
        .select({ count: count() })
        .from(workspaceMembersTable)
        .where(and(eq(workspaceMembersTable.workspaceId, workspaceId)))
        .then(row => Number(row[0].count ?? 0)),

      db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          role: workspaceMembersTable.role,
          financialProfile: usersTable.financialProfile,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .leftJoin(
          workspaceMembersTable,
          eq(usersTable.id, workspaceMembersTable.userId)
        )
        .where(eq(workspaceMembersTable.workspaceId, workspaceId))
        .limit(safeLimit)
        .offset(offset)
        .orderBy(desc(usersTable.name)),
    ])

    const totalPages = Math.ceil(totalCount / safeLimit)
    const safeTotalPages = Math.max(1, totalPages)
    if (safePage > safeTotalPages) {
      throw new Error('Page out of range. Please enter a valid page.')
    }

    return {
      data: members,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: safePage,
      limit: safeLimit,
    }
  }

  async getMemberById(
    workspaceId: string,
    memberId: string
  ): Promise<IMembersWithRole> {
    const [member] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: workspaceMembersTable.role,
        financialProfile: usersTable.financialProfile,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .leftJoin(
        workspaceMembersTable,
        eq(usersTable.id, workspaceMembersTable.userId)
      )
      .where(
        and(
          eq(workspaceMembersTable.workspaceId, workspaceId),
          eq(workspaceMembersTable.userId, memberId)
        )
      )

    // const member = await db.query.workspaceMembersTable.findFirst({
    //   columns: {
    //     id: false,
    //     userId: false,
    //     workspaceId: false,
    //     joinedAt: false,
    //   },
    //   where: and(
    //     eq(workspaceMembersTable.workspaceId, workspaceId),
    //     eq(workspaceMembersTable.userId, memberId)
    //   ),
    // })
    if (!member) throw new Error('Failed to get member role.')

    return member
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

  async changeMemberRole(
    workspaceId: string,
    memberId: string,
    newRole: ChangeRoleMemberDTO
  ): Promise<{ status: string }> {
    await db
      .update(workspaceMembersTable)
      .set({
        role: newRole,
      })
      .where(
        and(
          eq(workspaceMembersTable.workspaceId, workspaceId),
          eq(workspaceMembersTable.userId, memberId)
        )
      )

    return { status: 'Member role successfully changed.' }
  }

  async getUserRole(
    workspaceId: string,
    memberId: string
  ): Promise<IWorkspaceMember['role'] | null> {
    const role = await db.query.workspaceMembersTable.findFirst({
      columns: {
        id: false,
        userId: false,
        workspaceId: false,
        joinedAt: false,
      },
      where: and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, memberId)
      ),
    })
    return role?.role ?? null
  }
}
