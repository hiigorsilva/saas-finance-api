import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNull,
  or,
  sql,
} from 'drizzle-orm'
import { db } from '../../../db/connection'
import { usersTable } from '../../../db/schemas/users'
import { workspaceMembersTable } from '../../../db/schemas/workspace-members'
import { workspacesTable } from '../../../db/schemas/workspaces'
import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { IPaginationOutput } from '../../../shared/types/response'
import { generateSlug } from '../../../shared/utils/helpers'
import type {
  CreateWorkspaceDTO,
  IWorkspaceId,
  IWorkspaceOutput,
} from '../dto/workspace.dto'
import type {
  IWorkspaceDetails,
  IWorkspaceRepository,
  IWorkspaceSummary,
} from '../interfaces/workspace.interface'

export class WorkspaceRepository implements IWorkspaceRepository {
  async alreadyExistsByName(
    workspaceName: string,
    userId: string
  ): Promise<boolean> {
    const workspace = await db.query.workspacesTable.findFirst({
      where: and(
        eq(workspacesTable.name, workspaceName),
        eq(workspacesTable.ownerId, userId)
      ),
    })
    return !!workspace
  }

  async alreadyExistsById(workspaceId: string): Promise<boolean> {
    const workspace = await db.query.workspacesTable.findFirst({
      where: eq(workspacesTable.id, workspaceId),
    })
    return !!workspace
  }

  async save(data: CreateWorkspaceDTO, userId: string): Promise<IWorkspaceId> {
    const [workspace] = await db
      .insert(workspacesTable)
      .values({
        ownerId: userId,
        name: data.name,
        slug: generateSlug(data.name),
        description: data.description,
        type: data.type,
      })
      .returning({ id: workspacesTable.id })

    if (!workspace)
      throw new AppError(
        'Error creating workspace',
        500,
        ErrorCodes.WORKSPACE_CREATION_FAILED
      )

    return workspace
  }

  async isPrivateWorkspace(workspaceId: string): Promise<boolean> {
    const workspace = await db.query.workspacesTable.findFirst({
      where: and(
        eq(workspacesTable.id, workspaceId),
        eq(workspacesTable.type, 'PRIVATE'),
        isNull(workspacesTable.deletedAt)
      ),
    })
    return !!workspace
  }

  async list(
    userId: string,
    page = 1,
    limit = 50,
    searchWorkspace?: string
  ): Promise<IPaginationOutput<IWorkspaceSummary>> {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, Math.min(limit, 100))
    const offset = (safePage - 1) * safeLimit

    const normalizedSearch = searchWorkspace?.trim()
    const shouldSearch = !!normalizedSearch && normalizedSearch.length >= 3
    const startsWithTerm = shouldSearch ? `${normalizedSearch}%` : ''
    const containsTerm = shouldSearch ? `%${normalizedSearch}%` : ''

    const memberWorkspaceIds = db
      .select({ workspaceId: workspaceMembersTable.workspaceId })
      .from(workspaceMembersTable)
      .where(eq(workspaceMembersTable.userId, userId))

    const permissionClause = and(
      isNull(workspacesTable.deletedAt),
      or(
        eq(workspacesTable.ownerId, userId),
        inArray(workspacesTable.id, memberWorkspaceIds)
      )
    )

    const whereClause = shouldSearch
      ? and(
          permissionClause,
          or(
            ilike(workspacesTable.name, containsTerm),
            ilike(workspacesTable.description, containsTerm)
          )
        )
      : permissionClause

    const orderByClause = shouldSearch
      ? [
          sql`case
            when ${workspacesTable.name} ilike ${startsWithTerm} then 0
            when ${workspacesTable.name} ilike ${containsTerm} then 1
            when coalesce(${workspacesTable.description}, '') ilike ${containsTerm} then 2
            else 3
          end`,
          desc(workspacesTable.createdAt),
        ]
      : [desc(workspacesTable.createdAt)]

    const [totalCount, workspaces] = await Promise.all([
      db
        .select({ count: count() })
        .from(workspacesTable)
        .where(whereClause)
        .then(row => Number(row[0].count ?? 0)),

      db
        .select({
          id: workspacesTable.id,
          slug: workspacesTable.slug,
          name: workspacesTable.name,
          description: workspacesTable.description,
          type: workspacesTable.type,
          createdAt: workspacesTable.createdAt,
          updatedAt: workspacesTable.updatedAt,
          ownerName: usersTable.name,
          ownerId: usersTable.id,
          totalMembers: count(workspaceMembersTable.id),
        })
        .from(workspacesTable)
        .innerJoin(usersTable, eq(workspacesTable.ownerId, usersTable.id))
        .leftJoin(
          workspaceMembersTable,
          eq(workspacesTable.id, workspaceMembersTable.workspaceId)
        )
        .where(whereClause)
        .groupBy(
          workspacesTable.id,
          workspacesTable.slug,
          workspacesTable.name,
          workspacesTable.description,
          workspacesTable.type,
          workspacesTable.createdAt,
          workspacesTable.updatedAt,
          usersTable.id,
          usersTable.name
        )
        .limit(safeLimit)
        .offset(offset)
        .orderBy(...orderByClause),
    ])

    const totalPages = Math.ceil(totalCount / safeLimit)
    const safeTotalPages = Math.max(1, totalPages)
    if (safePage > safeTotalPages) {
      throw new AppError(
        'Page out of range. Please enter a valid page.',
        400,
        ErrorCodes.PAGE_OUT_OF_RANGE
      )
    }

    return {
      data: workspaces,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: safePage,
      limit: safeLimit,
    }
  }

  async findWorkspaceById(
    workspaceId: string
  ): Promise<IWorkspaceDetails | null> {
    const [workspace, members] = await Promise.all([
      db
        .select({
          id: workspacesTable.id,
          slug: workspacesTable.slug,
          name: workspacesTable.name,
          description: workspacesTable.description,
          type: workspacesTable.type,
          createdAt: workspacesTable.createdAt,
          updatedAt: workspacesTable.updatedAt,
          ownerName: usersTable.name,
          ownerId: usersTable.id,
          totalMembers: count(workspaceMembersTable.id),
        })
        .from(workspacesTable)
        .innerJoin(usersTable, eq(workspacesTable.ownerId, usersTable.id))
        .leftJoin(
          workspaceMembersTable,
          eq(workspacesTable.id, workspaceMembersTable.workspaceId)
        )
        .where(
          and(
            eq(workspacesTable.id, workspaceId),
            isNull(workspacesTable.deletedAt)
          )
        )
        .groupBy(
          workspacesTable.id,
          workspacesTable.slug,
          workspacesTable.name,
          workspacesTable.description,
          workspacesTable.type,
          workspacesTable.createdAt,
          workspacesTable.updatedAt,
          usersTable.id,
          usersTable.name
        ),

      db
        .select({
          id: workspaceMembersTable.id,
          userId: workspaceMembersTable.userId,
          workspaceId: workspaceMembersTable.workspaceId,
          role: workspaceMembersTable.role,
          joinedAt: workspaceMembersTable.joinedAt,
          userName: usersTable.name,
          userEmail: usersTable.email,
        })
        .from(workspacesTable)
        .innerJoin(
          workspaceMembersTable,
          eq(workspacesTable.id, workspaceMembersTable.workspaceId)
        )
        .innerJoin(usersTable, eq(workspaceMembersTable.userId, usersTable.id))
        .where(
          and(
            eq(workspacesTable.id, workspaceId),
            isNull(workspacesTable.deletedAt)
          )
        )
        .orderBy(workspaceMembersTable.joinedAt),
    ])

    if (!workspace || workspace.length === 0) {
      return null
    }

    const workspaceData = workspace[0]

    return {
      ...workspaceData,
      members,
    }
  }

  async findWorkspaceBySlug(slug: string): Promise<IWorkspaceDetails | null> {
    const [workspace, countMembers, members] = await Promise.all([
      db
        .select({
          id: workspacesTable.id,
          slug: workspacesTable.slug,
          name: workspacesTable.name,
          description: workspacesTable.description,
          type: workspacesTable.type,
          createdAt: workspacesTable.createdAt,
          updatedAt: workspacesTable.updatedAt,
          ownerName: usersTable.name,
          ownerId: usersTable.id,
        })
        .from(workspacesTable)
        .innerJoin(usersTable, eq(workspacesTable.ownerId, usersTable.id))
        .where(
          and(eq(workspacesTable.slug, slug), isNull(workspacesTable.deletedAt))
        ),

      db
        .select({ count: count() })
        .from(workspaceMembersTable)
        .innerJoin(
          workspacesTable,
          eq(workspaceMembersTable.workspaceId, workspacesTable.id)
        )
        .where(
          and(eq(workspacesTable.slug, slug), isNull(workspacesTable.deletedAt))
        ),

      db
        .select({
          id: workspaceMembersTable.id,
          userId: workspaceMembersTable.userId,
          workspaceId: workspaceMembersTable.workspaceId,
          role: workspaceMembersTable.role,
          joinedAt: workspaceMembersTable.joinedAt,
          userName: usersTable.name,
          userEmail: usersTable.email,
        })
        .from(workspacesTable)
        .innerJoin(
          workspaceMembersTable,
          eq(workspacesTable.id, workspaceMembersTable.workspaceId)
        )
        .innerJoin(usersTable, eq(workspaceMembersTable.userId, usersTable.id))
        .where(
          and(eq(workspacesTable.slug, slug), isNull(workspacesTable.deletedAt))
        )
        .orderBy(workspaceMembersTable.joinedAt),
    ])

    if (!workspace || workspace.length === 0) {
      return null
    }

    const workspaceData = workspace[0]
    const totalMembers = countMembers[0].count ?? 0

    return {
      ...workspaceData,
      totalMembers,
      members,
    }
  }

  async remove(
    workspaceId: string,
    userId: string
  ): Promise<{ status: string }> {
    await db
      .delete(workspacesTable)
      .where(
        and(
          eq(workspacesTable.id, workspaceId),
          eq(workspacesTable.ownerId, userId)
        )
      )
    return { status: 'Workspace deleted successfully.' }
  }

  async edit(
    workspaceId: string,
    userId: string,
    data: CreateWorkspaceDTO
  ): Promise<IWorkspaceOutput> {
    const [workspace] = await db
      .update(workspacesTable)
      .set({
        name: data.name,
        description: data.description,
        type: data.type,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(workspacesTable.ownerId, userId),
          eq(workspacesTable.id, workspaceId)
        )
      )
      .returning({
        id: workspacesTable.id,
        name: workspacesTable.name,
        slug: workspacesTable.slug,
        description: workspacesTable.description,
        type: workspacesTable.type,
        ownerId: workspacesTable.ownerId,
        createdAt: workspacesTable.createdAt,
        updatedAt: workspacesTable.updatedAt,
      })

    return workspace
  }
}
