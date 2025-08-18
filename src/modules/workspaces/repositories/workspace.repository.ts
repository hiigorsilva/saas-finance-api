import { and, count, desc, eq, isNull } from 'drizzle-orm'
import { Roles } from '../../../data/roles'
import { db } from '../../../db/connection'
import { workspaceMembersTable } from '../../../db/schemas/workspace-members'
import { workspacesTable } from '../../../db/schemas/workspaces'
import type {
  IWorkspace,
  IWorkspaceRepository,
} from '../../../interfaces/workspaces/workspace.interface'
import type { IPaginationOutput } from '../../../shared/types/response'
import type {
  CreateWorkspaceDTO,
  IWorkspaceId,
  IWorkspaceOutput,
} from '../dto/workspace.dto'

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
        description: data.description,
        type: data.type,
      })
      .returning({ id: workspacesTable.id })

    if (!workspace) throw new Error('Error creating workspace')

    //TODO: ADICIONAR ESSA QUERY NO SERVICE APOS CRIAR O WORKSPACE
    await db.insert(workspaceMembersTable).values({
      workspaceId: workspace.id,
      userId: userId,
      role: Roles.OWNER,
      joinedAt: new Date(),
    })

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
    limit = 10
  ): Promise<IPaginationOutput<IWorkspaceOutput>> {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, Math.min(limit, 100))
    const offset = (safePage - 1) * safeLimit

    const [totalCount, workspaces] = await Promise.all([
      db
        .select({ count: count() })
        .from(workspacesTable)
        .where(isNull(workspacesTable.deletedAt))
        .then(row => Number(row[0].count ?? 0)),

      db.query.workspacesTable.findMany({
        columns: {
          id: true,
          name: true,
          description: true,
          type: true,
          deletedAt: false,
        },
        where: and(
          eq(workspacesTable.ownerId, userId),
          isNull(workspacesTable.deletedAt)
        ),
        limit: safeLimit,
        offset: offset,
        orderBy: desc(workspacesTable.createdAt),
      }),
    ])

    const totalPages = Math.ceil(totalCount / safeLimit)
    const safeTotalPages = Math.max(1, totalPages)
    if (safePage > safeTotalPages) {
      throw new Error('Page out of range. Please enter a valid page.')
    }

    return {
      data: workspaces,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: safePage,
      limit: safeLimit,
    }
  }

  async findWorkspaceById(workspaceId: string): Promise<IWorkspace | null> {
    const workspace = await db.query.workspacesTable.findFirst({
      columns: {
        deletedAt: false,
      },
      where: and(
        eq(workspacesTable.id, workspaceId),
        isNull(workspacesTable.deletedAt)
      ),
    })
    return workspace ?? null
  }

  async delete(
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

  async update(
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
        description: workspacesTable.description,
        type: workspacesTable.type,
        ownerId: workspacesTable.ownerId,
        createdAt: workspacesTable.createdAt,
        updatedAt: workspacesTable.updatedAt,
      })

    return workspace
  }
}
