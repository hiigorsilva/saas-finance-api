import { and, eq, isNull } from 'drizzle-orm'
import { db } from '../db/connection'
import { workspacesTable } from '../db/schemas/workspaces'
import type {
  IWorkspace,
  IWorkspaceId,
  IWorkspaceRepository,
} from '../interfaces/workspace'
import type { CreateWorkspaceBodyType } from '../schemas/workspace-schema'

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
    return { status: 'workspace deleted successfully.' }
  }
}
