import { and, eq, isNull } from 'drizzle-orm'
import { Roles } from '../data/roles'
import { db } from '../db/connection'
import { workspaceMembersTable } from '../db/schemas/workspace-members'
import { workspacesTable } from '../db/schemas/workspaces'
import type {
  IWorkspace,
  IWorkspaceDetails,
  IWorkspaceId,
  IWorkspaceRepository,
} from '../interfaces/workspaces/workspace'
import type { CreateWorkspaceBodyType } from '../schemas/workspaces/workspace-schema'

export class WorkspaceRepository implements IWorkspaceRepository {
  async create(
    data: CreateWorkspaceBodyType,
    userId: string
  ): Promise<IWorkspaceId> {
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

    await db.insert(workspaceMembersTable).values({
      workspaceId: workspace.id,
      userId: userId,
      role: Roles.OWNER,
      joinedAt: new Date(),
    })

    return workspace
  }

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

  async alreadyExistsById(
    workspaceId: string,
    userId: string
  ): Promise<boolean> {
    const workspace = await db.query.workspacesTable.findFirst({
      where: and(
        eq(workspacesTable.id, workspaceId),
        eq(workspacesTable.ownerId, userId)
      ),
    })
    return !!workspace
  }

  async list(userId: string): Promise<IWorkspace[]> {
    const workspaces = await db.query.workspacesTable.findMany({
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
    })
    return workspaces
  }

  async findWorkspaceById(
    userId: string,
    workspaceId: string
  ): Promise<IWorkspaceDetails | null> {
    const workspace = await db.query.workspacesTable.findFirst({
      columns: {
        deletedAt: false,
      },
      where: and(
        eq(workspacesTable.ownerId, userId),
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
    data: CreateWorkspaceBodyType
  ): Promise<IWorkspaceDetails> {
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
